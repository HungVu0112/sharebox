export function authValid(data) {
    let error = {}

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

export function userInfo(data) {
    let error = {}

    if(data.userName === "") { 
        error.userName = "userName should not be empty";
    } else { 
        error.userName = "";
    }
    
    return error;
}
