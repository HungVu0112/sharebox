interface Error {
    email: string,
    password: string
}

export function authValid(data: any) {
    const error: Error = {
        email: "",
        password: ""
    }

    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if(data.email === "") {
        error.email = "Email should not be empty";
    } else if( !email_pattern.test( data.email ) ) {
        error.email = "Email didn't match";
    } else { 
        error.email = "";
    }
    
    if(data.password === "") {
        error.password = "Password should not be empty";
    } else {
        error.password = "";
    }    
    
    return error;
}
