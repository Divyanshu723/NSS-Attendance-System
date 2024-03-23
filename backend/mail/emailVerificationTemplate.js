const otpTemplate = (otp) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>OTP Verification Email</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
			}
	
			.logo {
				max-width: 150px;
				margin-bottom: 20px;
			}
	
			.message {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 20px;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
	
			.highlight {
				font-weight: bold;
			}
		</style>
	
	</head>
	
	<body>
		<div class="container">
			<a href="#"><img class="logo"
					src="https://i.ibb.co/Gs1knSw/nssLogo.png" alt="NSS NIT JSR Logo"></a>
			<div class="message">OTP Verification Email</div>
			<div class="body">
				<p>Dear User,</p>
				<p>This is your OTP(One Time Password)</p>
				<h2 class="highlight">${otp}</h2>
				<p>Use this OTP to login</p>
			</div>
			<div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
					href="mailto:mohapatrasatya152@gmail.com">mohapatrasatya152@gmail.com</a>. We are here to help!</div>
		</div>
	</body>
	
	</html>`;
};
module.exports = otpTemplate;