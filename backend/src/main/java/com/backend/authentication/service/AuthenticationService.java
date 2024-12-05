package com.backend.authentication.service;

import com.backend.authentication.dto.request.IntrospectRequest;
import com.backend.authentication.dto.request.LoginRequest;
import com.backend.authentication.dto.request.LogoutRequest;
import com.backend.authentication.dto.response.AuthenticationResponse;
import com.backend.authentication.dto.response.IntrospectResponse;
import com.backend.authentication.entity.Token;
import com.backend.authentication.entity.User;
import com.backend.authentication.exception.AppException;
import com.backend.authentication.exception.ErrorCode;
import com.backend.authentication.repository.TokenRepository;
import com.backend.authentication.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    UserRepository userRepository;
    TokenRepository tokenRepository;

    FriendRequestService friendRequestService;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected  String SIGNER_KEY;

    //Thoi gian token het han
    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long  VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    public IntrospectResponse introspect(IntrospectRequest request)
            throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;

        try {
            verifyToken(token, false);
        } catch (AppException e){
            isValid = false;
        }
        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }

    public String generateToken(User user){
        //header cua JWT
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        // build payload cho JWT
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("sharebox-auth.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        //signature JWT
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e){
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }

    }

    public void logoutAccount(LogoutRequest request) throws ParseException, JOSEException {
        try{
            var signToken = verifyToken(request.getToken(), true);
            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            Token invalidatedToken = Token.builder()
                    .id(jit)
                    .expiryTime(expiryTime)
                    .build();

            tokenRepository.save(invalidatedToken);
        } catch (AppException exception){
            log.info("Token already expired");
        }
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                .toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified =signedJWT.verify(verifier);

        if(!(verified) && expiryTime.after(new Date()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        if(tokenRepository.existsById(signedJWT
                .getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHORIZED);

        return signedJWT;
    }

    private String buildScope(User user){
        StringJoiner stringJoiner = new StringJoiner(" ");
        if(!CollectionUtils.isEmpty(user.getRoles()))
            user.getRoles().forEach(stringJoiner::add);
        return stringJoiner.toString();
    }

    public AuthenticationResponse loginAccount(LoginRequest request) {

        var user = userRepository.findByUserEmail(request.getUserEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        user.setOnline(true);

        var savedUser = userRepository.save(user);

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated)
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        var token = generateToken(user);

        friendRequestService.notifyFriendsAboutOnlineStatus(savedUser);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .user(savedUser)
                .build();

    }
}
