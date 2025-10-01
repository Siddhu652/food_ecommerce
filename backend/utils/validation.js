function validEmail(mailid){
    if(!mailid) return false;
    let cleaned = mailid.trim(); 
         // remove spaces
    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(cleaned);
}

function validPhone(phoneNo) {
  return /^\d{10}$/.test(phoneNo);
}


function validTime(timing){
    const time_format = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
    return time_format.test(timing.trim());
}

function isImage(file) {
  if (!file) return false;
  return file.mimetype.startsWith("image/");
}

module.exports = { validEmail, validTime , isImage, validPhone};
