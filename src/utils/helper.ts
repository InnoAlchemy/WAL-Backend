export const generateToken = (lenght = 6) => {
    // declare a variable 
    let otp = "";

    for(let i =0; i < lenght; i++){
        const digit = Math.floor(Math.random() * 10)

        otp = digit + otp;
    }
    return otp;
    
};