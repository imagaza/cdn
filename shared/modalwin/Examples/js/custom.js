$(document).ready(function(){
	/* OnPageLoad Modal */
	$( window ).load(function() {
		rplm({
			title: "GeeksLabs welcomes you!!",
			text: "Get all the replete modal demos here to get an idea what's inside that. Have a great Day ahead!!",
			imageUrl: "img/happy_smiley.png",
			imageSize: "64x64",
			animation: "bounce",
			confirmButtonText: 'Okay',
			allowOutsideClick: true,
			preventDialog: true,
			cookieName:'blockModal',
			preventText: 'Block This pop-up',
		});
	});

	$('html').mouseleave(function() {
		rplm({
			title: "We'll miss you!!",
			text: "Please come back soon.",
			imageUrl: "img/sad_smiley.png",
			imageSize: "64x64",
			animation: "slideInDown",
			confirmButtonText: 'Cool',
			allowOutsideClick: true,
			preventDialog: true,
			cookieName:'blockModal',
			preventText: "Don't show this again",
		});
	});

	/* Prevent Modal */
	$('.cookie').on('click',function(){
		rplm({
			title: "Block Pop-up",
			text: "Click on 'Block this pop-up' to block this pop-up.",
			showCancelButton: false,
			animation: "tada",
			confirmButtonText: 'Submit',
			allowOutsideClick: true,
			preventDialog: true,
			cookieName:'blockModal',
			preventText: 'Block This pop-up',
		});
	});
	/* Positions Start */
	$('.topleft').on('click',function(){
		rplm({
			title: "Top Left",
			text: $('.paragraph').html(),
			html: true,
			position:'topLeft',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.topcenter').on('click',function(){
		rplm({
			title: "Top Center",
			text: $('.paragraph').html(),
			html: true,
			position:'topCenter',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
			width: '580px'
		});
	});
	$('.topright').on('click',function(){
		rplm({
			title: "Top Right",
			text: $('.paragraph').html(),
			html: true,
			position:'topRight',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.leftcenter').on('click',function(){
		rplm({
			title: "Left Center",
			text: $('.paragraph').html(),
			html: true,
			position:'leftCenter',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.center').on('click',function(){
		rplm({
			title: "Center!",
			text: $('.paragraph').html(),
			html: true,
			position:'center',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.rightcenter').on('click',function(){
		rplm({
			title: "Right Center",
			text: $('.paragraph').html(),
			html: true,
			position:'rightCenter',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.bottomleft').on('click',function(){
		rplm({
			title: "Bottom Left",
			text: $('.paragraph').html(),
			html: true,
			position:'bottomLeft',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.bottomcenter').on('click',function(){
		rplm({
			title: "Bottom Center",
			text: $('.paragraph').html(),
			html: true,
			position:'bottomCenter',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.bottomright').on('click',function(){
		rplm({
			title: "Bottom Right",
			text: $('.paragraph').html(),
			html: true,
			position:'bottomRight',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	/* Positions End */

	/* Overlay Start */
	$('.blackoverlay').on('click',function(){
		rplm({
			title: "Black Overlay",
			text: $('.paragraph').html(),
			html: true,
			overlay: 'black',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			showLoaderOnConfirm: true,
			allowOutsideClick: true,
		});
	});
	$('.whiteoverlay').on('click',function(){
		rplm({
			title: "White Overlay",
			text: $('.paragraph').html(),
			html: true,
			overlay: 'white',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
			showLoaderOnConfirm: true,
		});
	});
	$('.customoverlay').on('click',function(){
		rplm({
			title: "Custom Color Overlay",
			text: $('.paragraph').html(),
			html: true,
			overlay: 'custom',
			customOverlayColor:'#46B9B1',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			showLoaderOnConfirm: true,
			allowOutsideClick: true,
		});
	});
	$('.transparentoverlay').on('click',function(){
		rplm({
			title: "Transparent Overlay",
			text: $('.paragraph').html(),
			html: true,
			overlay: 'transparent',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			showLoaderOnConfirm: true,
			allowOutsideClick: true,
		});
	});
	$('.bluroverlay').on('click',function(){
		rplm({
			title: "Blur Overlay",
			text: $('.paragraph').html(),
			html: true,
			overlay: 'blur',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			showLoaderOnConfirm: true,
			allowOutsideClick: true,
		});
	});
	/* Overlay End */
	
	/* Transition Effects Start */
	$('.bounce').on('click',function(){
		rplm({
			title: "Bounce Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'bounce',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.flash').on('click',function(){
		rplm({
			title: "Flash Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'flash',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.pulse').on('click',function(){
		rplm({
			title: "Pulse Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'pulse',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.rubberBand').on('click',function(){
		rplm({
			title: "Rubber Band Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'rubberBand',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.shake').on('click',function(){
		rplm({
			title: "Shake Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'shake',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.swing').on('click',function(){
		rplm({
			title: "Swing Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'swing',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.tada').on('click',function(){
		rplm({
			title: "Tada Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'tada',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.wobble').on('click',function(){
		rplm({
			title: "Wobble Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'wobble',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.jello').on('click',function(){
		rplm({
			title: "Jello Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'jello',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.bounceIn').on('click',function(){
		rplm({
			title: "BounceIn Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'bounceIn',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.bounceInDown').on('click',function(){
		rplm({
			title: "BounceInDown Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'bounceInDown',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.bounceInLeft').on('click',function(){
		rplm({
			title: "BounceInLeft Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'bounceInLeft',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.bounceInRight').on('click',function(){
		rplm({
			title: "BounceInRight Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'bounceInRight',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.bounceInUp').on('click',function(){
		rplm({
			title: "BounceInUp Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'bounceInUp',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.fadeIn').on('click',function(){
		rplm({
			title: "FadeIn Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'fadeIn',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.fadeInDown').on('click',function(){
		rplm({
			title: "FadeInDown Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'fadeInDown',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.fadeInDownBig').on('click',function(){
		rplm({
			title: "FadeInDownBig Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'fadeInDownBig',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.fadeInLeft').on('click',function(){
		rplm({
			title: "FadeInLeft Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'fadeInLeft',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.fadeInLeftBig').on('click',function(){
		rplm({
			title: "FadeInLeftBig Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'fadeInLeftBig',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.fadeInRight').on('click',function(){
		rplm({
			title: "FadeInRight Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'fadeInRight',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.fadeInRightBig').on('click',function(){
		rplm({
			title: "FadeInRightBig Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'fadeInRightBig',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.fadeInUp').on('click',function(){
		rplm({
			title: "FadeInUp Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'fadeInUp',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.fadeInUpBig').on('click',function(){
		rplm({
			title: "FadeInUpBig Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'fadeInUpBig',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.flipInX').on('click',function(){
		rplm({
			title: "FlipInX Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'flipInX',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.flipInY').on('click',function(){
		rplm({
			title: "FlipInY Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'flipInY',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.lightSpeedIn').on('click',function(){
		rplm({
			title: "LightSpeedIn Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'lightSpeedIn',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.rotateIn').on('click',function(){
		rplm({
			title: "RotateIn Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'rotateIn',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.rotateInDownLeft').on('click',function(){
		rplm({
			title: "RotateInDownLeft Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'rotateInDownLeft',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.rotateInDownRight').on('click',function(){
		rplm({
			title: "RotateInDownRight Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'rotateInDownRight',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.rotateInUpLeft').on('click',function(){
		rplm({
			title: "RotateInUpLeft Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'rotateInUpLeft',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.rotateInUpRight').on('click',function(){
		rplm({
			title: "RotateInUpRight Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'rotateInUpRight',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.slideInUp').on('click',function(){
		rplm({
			title: "SlideInUp Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'slideInUp',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.slideInDown').on('click',function(){
		rplm({
			title: "SlideInDown Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'slideInDown',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.slideInLeft').on('click',function(){
		rplm({
			title:"SlideInLeft Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'slideInLeft',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.slideInRight').on('click',function(){
		rplm({
			title: "SlideInRight Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'slideInRight',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.zoomIn').on('click',function(){
		rplm({
			title: "ZoomIn Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'zoomIn',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.zoomInDown').on('click',function(){
		rplm({
			title: "ZoomInDown Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'zoomInDown',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.zoomInLeft').on('click',function(){
		rplm({
			title: "ZoomInLeft Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'zoomInLeft',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.zoomInRight').on('click',function(){
		rplm({
			title: "ZoomInRight Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'zoomInRight',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.zoomInUp').on('click',function(){
		rplm({
			title: "ZoomInUp Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'zoomInUp',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.rollIn').on('click',function(){
		rplm({
			title: "RollIn Effect",
			text: $('.paragraph').html(),
			html: true,
			animation: 'rollIn',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	/* Transition Effects End */

	/* Modal Candies Start */
	$('.whiteCandie').on('click',function(){
		rplm({
			title: "White Modal",
			text: $('.paragraph').html(),
			html: true,
			animation: "fadeIn",
			modalNOverlay: 'white',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
		});
	});
	$('.blackCandie').on('click',function(){
		rplm({
			title: "Black Modal",
			text: $('.paragraph').html(),
			html: true,
			animation: "swing",
			modalNOverlay: 'black',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
		});
	});
	$('.customCandie').on('click',function(){
		rplm({
			title: "Custom Color Modal",
			text: $('.paragraph').html(),
			html: true,
			animation: "bounceIn",
			modalNOverlay: 'custom',
			closeButtonColor: "white",
			customModalColor: "#50858B",
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
		});
	});
	
	$('.squareCandie').on('click',function(){
		rplm({
			title: "Round Border Modal",
			text: $('.paragraph').html(),
			html: true,
			closeButtonColor: "white",
			modalNOverlay: 'roundBorder',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
		});
	});
	$('.transparentCandie').on('click',function(){
		rplm({
			title:"Transparent Modal",
			text: $('.paragraph').html(),
			html: true,
			animation: "rotateIn",
			modalNOverlay: 'transparent',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
		});
	});
	$('.backShadowCandie').on('click',function(){
		rplm({
			title: "Back Shadow Modal",
			text: $('.paragraph').html(),
			html: true,
			animation: "tada",
			modalNOverlay: 'backShadow',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
		});
	});
	$('.closeIconIn').on('click',function(){
		rplm({
			title: "Close Icon In",
			text: "Check close Icon Inside The Modal.",
			html: true,
			showCancelButton: false,
			animation: 'jello',
			allowOutsideClick: true,
			modalNOverlay: 'white',
			showCloseButton: true,
			closeButtonWithInModal: true,
			confirmButtonText: 'Done',
		});
	});
	$('.closeIconOut').on('click',function(){
		rplm({
			title: "Close Icon Out",
			text: "Check close Icon Outside The Modal.",
			html: true,
			showCancelButton: false,
			animation: 'lightSpeedIn',
			allowOutsideClick: true,
			modalNOverlay: 'white',
			showCloseButton: true,
			confirmButtonText: 'Done',
		});
	});
	$('.closeTextIn').on('click',function(){
		rplm({
			title: "Close Text In",
			text: "Check close Text Inside The Modal.",
			html: true,
			showCancelButton: false,
			animation: 'rollIn',
			allowOutsideClick: true,
			modalNOverlay: 'white',
			showCloseButton: true,
			closeButtonWithInModal: true,
			closeButtonText: "Close Me!",
			confirmButtonText: 'Done',
		});
	});
	$('.closeTextOut').on('click',function(){
		rplm({
			title: "Close Text Out",
			text: "Check close Text Outside The Modal.",
			html: true,
			showCancelButton: false,
			animation: 'jello',
			allowOutsideClick: true,
			modalNOverlay: 'white',
			showCloseButton: true,
			closeButtonText: "Close Me!",
			confirmButtonText: 'Done',
		});
	});
	/* Modal Candies End */

	/* Simple Examples Start */
	$('.contact').on('click',function(){
		var conForm = $('.contactForm').html();
		rplm({
			title: "Get In Touch!!",
			text: "Get in touch with us and we'll be with you as soon as possible!<br><br>" + conForm,
			imageUrl: "img/mail.png",
			html: true,
			animation: "rotateIn",
			modalNOverlay: 'white',
			overlay: 'blur',
			confirmButtonText: 'Submit',
			showCloseButton: true,
			closeButtonWithInModal: true,
		});
	});
	$('.login').on('click',function(){
		var loginForm = $('.loginForm').html();
		rplm({
			title: "Login",
			text: "Sign in below to access all the features available to you.<br><br>" + loginForm,
			imageUrl: "img/login.png",
			html: true,
			animation: "swing",
			modalNOverlay: 'transparent',
			overlay: 'blur',
			confirmButtonText: 'Login',
			showCloseButton: true,
			closeButtonWithInModal: true,
		});
	});
	$('.register').on('click',function(){
		var registerForm = $('.registerForm').html();
		rplm({
			title: "Register",
			text: "Sign up for free.<br><br>" + registerForm,
			imageUrl: "img/register.png",
			html: true,
			animation: "jello",
			overlay: 'blur',
			allowOutsideClick: true,
			confirmButtonText: 'Register'
		});
	});
	$('.tsheet').on('click',function(){
		var tsheetForm = $('.tsheetForm').html();
		rplm({
			title: "Time Sheet",
			text: "Add an entry to your time sheet.<br><br>" + tsheetForm,
			html: true,
			animation: "jello",
			overlay: 'blur',
			confirmButtonText: 'Submit',
			allowOutsideClick: true,
		});
	});
	$('.comment').on('click',function(){
		var commentForm = $('.commentForm').html();
		rplm({
			title: "Your Comments",
			text: commentForm,
			imageUrl: "img/comment.png",
			html: true,
			animation: "rotateIn",
			modalNOverlay: 'white',
			overlay: 'black',
			confirmButtonText: 'Post Comment',
			allowOutsideClick: true,
		});
	});
	$('.booking').on('click',function(){
		var bookingForm = $('.bookingForm').html();
		rplm({
			title: "Book Your Holiday",
			text: bookingForm,
			html: true,
			showCancelButton: false,
			closeOnConfirm: true,
			animation: "tada",
			overlay: 'black',
			confirmButtonText: 'Book Now',
			allowOutsideClick: true,
		});
	});
	$('.feedback').on('click',function(){
		var feedbackForm = $('.feedbackForm').html();
		rplm({
			title: "FeedBack",
			text: "We appreciate your FeedBack. "+feedbackForm,
			html: true,
			showCancelButton: false,
			closeOnConfirm: false,
			animation: "tada",
			modalNOverlay: 'white',
			overlay: 'black',
			confirmButtonText: 'Submit FeedBack',
			allowOutsideClick: true,
		});
	});
	$('.subscribe').on('click',function(){
		rplm({
			title: "Get daily updates for free!",
			text: "Signup to our awesome newsletter and receive fresh daily news",
			type: "input",
			inputPlaceholder: "Subscribe with email",
			imageUrl: "img/letter.png",
			animation: 'jello',
			modalNOverlay: 'black',
			overlay: 'blur',
			allowOutsideClick: true ,
			confirmButtonText: 'Sign Me Up',
		});
	});
	$('.adv').on('click',function(){
		rplm({
			title: "",
			text: $('.advForm').html(),
			html: true,
			width: '300px',
			showConfirmButton: false,
			animation: 'slideInUp',
			position: 'bottomCenter',
			allowOutsideClick: true,
			modalNOverlay: 'transparent',
		});
	});
	$('.ajax-submit').on('click',function(){
		var loginForm = $('.loginForm').html();
		rplm({
			title: "Login",
			text: "Sign in below to access all the features available to you.<br><br>" + loginForm,
			imageUrl: "img/login.png",
			html: true,
			animation: "swing",
			modalNOverlay: 'white',
			overlay: 'blur',
			confirmButtonText: 'Login',
			showCloseButton: true,
			closeButtonWithInModal: true,
			showLoaderOnConfirm: true,
		}, function(){
			// Ajax call
			$.ajax({
				url: "test.php",
				data: $('.rplm-alert form.login').serialize(),
				method: "post",
			}).done(function() {
				console.log('Done');
			});
		});
	});
	$('.youtube').on('click',function(){
		rplm({
			title: "Get Close With Nature",
			imageUrl: "img/nature.png",
			html: true,
			showConfirmButton: false,
			animation: 'fadeIn',
			allowOutsideClick: true,
			modalNOverlay: 'black',
			youtubeID: "mcixldqDIEQ",
			videoHeight: "315",
			videoWidth: "100%",
		});
	});
	$('.vimeo').on('click',function(){
		rplm({
			title: "Nature on vimeo",
			html: true,
			showConfirmButton: false,
			animation: 'fadeIn',
			allowOutsideClick: true,
			modalNOverlay: 'white',
			vimeoID: "95746815",
			videoHeight: "315",
			videoWidth: "100%",
		});
	});
	$('.delay').on('click',function(){
		rplm({
			title: "Delay 2 Seconds",
			text: $('.paragraph').html(),
			html: true,
			showConfirmButton: true,
			delay: 2,
			animation: 'fadeIn',
			allowOutsideClick: true,
			confirmButtonText: 'Done',
		});
	});
	$('.duration').on('click',function(){
		rplm({
			title: "Duration 2 Seconds",
			text: $('.paragraph').html(),
			html: true,
			showConfirmButton: true,
			animation: 'fadeIn',
			allowOutsideClick: true,
			confirmButtonText: 'Done',
			duration: 2,
		});
	});
	$('.delayDura').on('click',function(){
		rplm({
			title: "Delay 1 Second & Duration 2 Seconds",
			text: $('.paragraph').html(),
			html: true,
			showConfirmButton: true,
			delay: 1,
			duration: 2,
			animation: 'fadeIn',
			allowOutsideClick: true,
			confirmButtonText: 'Done',
		});
	});
	
	/* Simple Examples End */
	
	/* Modal Pop up Types Start */
	$('.warning').on('click',function(){
		rplm({
			title: "Warning!!",
			text: 'Beware! You might be on wrong path.',
			type: 'warning',
			html: true,
			closeOnConfirm: false,
			modalNOverlay: 'white',
			confirmButtonText: 'Done',
			showLoaderOnConfirm: true,
			allowOutsideClick: true,
		});
	});
	$('.error').on('click',function(){
		rplm({
			title: "Error!",
			text: "Opps!! You might finding something else.",
			html: true,
			type: 'error',
			modalNOverlay: 'white',
			cancelButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.sucState').on('click',function(){
		rplm({
			title: "Success",
			text: 'Congratulations!! Finally you get this page.',
			type: 'success',
			html: true,
			modalNOverlay: 'white',
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.infoState').on('click',function(){
		rplm({
			title: "Information",
			text: 'This is an information alert!',
			type: 'info',
			html: true,
			modalNOverlay: 'black',
			cancelButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.confirmAction').on('click',function(){
		rplm({
				title: "Confirm",
				text: "Do you want to remove this file?",
				type: "warning",
				showCancelButton: true,
				confirmButtonText: "Yes, Remove!",
				closeOnConfirm: false
			},
			function(){
				rplm({
					title: "Removed!",
					text: "Your file has been removed.",
					type: "success",
					confirmButtonText: 'Done',
				});
		});
	});
	$('.confirmCancel').on('click',function(){
		rplm({
				title: "Confirm",
				text: "Do you want to remove this file?",
				type: "warning",
				showCancelButton: true,
				confirmButtonText: "Yes, Remove!",
				cancelButtonText: "No, Cancel Remove!",
				closeOnConfirm: false,
				closeOnCancel: false
			},
			function(isConfirm){
				if (isConfirm) {
					rplm({
						title: "Removed!",
						text: "Your file has been removed.",
						type: "success",
						confirmButtonText: 'Done',
					});
				}
				else{
					rplm({
						title: "Cancelled!",
						text: "Your file is Safe.",
						type: "error",
						confirmButtonText: 'Done',
					});
				}
		});
	});
	$('.html').on('click',function(){
		rplm({
			title: "HTML <i> Section </i>",
			text: '<h1>This is Heading1</h1><br><p>Custom <span style="font-size:1em; color:#A6E22D;"> HTML</span> Section Message.</p>',
			html: true,
			animation: 'swing',
			modalNOverlay: 'black',
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.timer').on('click',function(){
		rplm({
			title: "Close on timer set!",
			text: "I will close in 2 seconds.",
			timer: 2000,
			animation: 'swing',
			modalNOverlay: 'black',
			svgIcon: 'heart',
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
	$('.validation').on('click',function(){
		rplm({
			title: "An input!",
			text: "Write something interesting:",
			type: "input",
			showCancelButton: true,
			closeOnConfirm: false,
			animation: "slide-from-top",
			inputPlaceholder: "Write something"
		},
		function(inputValue){
			if (inputValue === false)
				return false;
			if (inputValue === "") {
				rplm.showInputError("You need to write something!");
				return false;
			}
			rplm({
				title: "Nice!",
				text: "You wrote: " + inputValue,
				type: "success",
				confirmButtonText: 'Done',
				closeOnConfirm: false,
				});
		});
	});
	$('.ajax').on('click',function(){
		rplm({
			title: "Ajax request example",
			text: "Submit to run ajax request",
			type: "info",
			showCancelButton: true,
			closeOnConfirm: false,
			showLoaderOnConfirm: true,
		},
		function(){
			setTimeout(function(){
				rplm({
					title:"",
					text:"Ajax request finished!",
					type: "success",
					confirmButtonText: 'Done',
					closeOnConfirm: false,
					showLoaderOnConfirm: true,
					});
			}, 2000);
		});
	});
	/* Modal Pop up Types End */
	
	/* SVG Icon */
	$('.svg').on('click',function(){
		var svgIconVar = $(this).data('icon');
		rplm({
			title: svgIconVar+" SVG Icon",
			text: "This is SVG Icon Demo",
			svgIcon: svgIconVar,
			confirmButtonText: 'Done',
			allowOutsideClick: true,
		});
	});
});
