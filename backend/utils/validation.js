function validEmail(mailid){
    if(!mailid) return false;
    let cleaned = mailid.trim(); 
         // remove spaces
    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(cleaned);
}


function validTime(timing){
    const time_format = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
    return time_format.test(timing.trim());
}


module.exports = { validEmail, validTime };
