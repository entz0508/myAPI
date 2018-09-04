var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport("SMTP", {
    service: 'Gmail',
    auth: {
        user: 'nnnok1',
        pass: '0211mmmm'
    }
});

var mailOptions = {
    from: '류정현 <nnnok1@blueark.com>',
    to: 'nnnok1@lycos.co.kr',
    subject: 'Nodemailer 테스트',
    text: '평문 보내기 테스트 '
};

smtpTransport.sendMail(mailOptions, function(error, response){

    if (error){
        console.log(error);
    } else {
        console.log("Message sent : " + response.message);
    }
    smtpTransport.close();
});
