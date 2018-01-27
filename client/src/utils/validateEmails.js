const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default (emails) => {
    const invalidEmailsArray =  emails
                         .split(',')    // split will return an array of emaiil strings
                         .map(email => email.trim()) // we need to trim white spaces from each email string in this array and return this new array.
                         .filter(email => emailRegex.test(email) === false); // keep the invalid emails in the  filter

    if (invalidEmailsArray.length) {
        return `These emails are invalid ${invalidEmailsArray}`;
    }

    return;
};