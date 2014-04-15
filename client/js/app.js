var spinner = {};
$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

// -------------- LOGIN
$(function() {
	var loginButton = $('.register .login.item .show_popap')
	var loginForm =  $('.register .login.form')
	var loginSubmitButton = loginForm.find('.force_submit')
	var loginFormReqRes = $('.login.popap .req_res')
	loginButton.on({
		click: function(e) {
			e.stopImmediatePropagation()
			e.preventDefault();
			$(this).parent().toggleClass('active').siblings().removeClass('active')

			return false
		}
	})
	loginSubmitButton.on({
		click: function(e) {
			e.preventDefault();
			e.stopImmediatePropagation()
			loginForm.submit();
		}
	})
	loginForm.submit(function(e) {
		e.preventDefault()
		console.log('loginForm submit')

		$.ajax({
			url: '/login',
			type: 'POST',
			data: {
				query: loginForm.serializeObject()
			}
		})
		.done(function(res) {
			console.log('res data:', res)
			if (!res.success) {
				if (res.err.code) {
					switch (res.err.code) {
						case 11000 :
						loginFormReqRes.removeClass('success').addClass('error').html('Такой пользователь уже зарегистрирован!')
						break
					}
				} else {
					loginFormReqRes.removeClass('success').addClass('error').html('Регистрация не удалась, попробуйте еще разок')
				}
			} else {
				$('body').addClass('authorised')
				loginFormReqRes.removeClass('error').addClass('success').html('Регистрация прошла успешно!')
				$('body.authorised .register .login.item.active').on({
					mouseleave: function() {
						$(this).removeClass('active')
					}
				})
			}

		})
		.fail(function(err) {
			console.log('error')
			console.log(err);
		})
		.always(function() {
			console.log("complete");
		});   
	})
});
// ------------- END LOGIN

// ------------- SIGNIN
$(function() {
	var signinButton = $('.register .signin.item .show_popap')
	var signinForm = $('.register .signin.form') 
	var signinSubmitButton = signinForm.find('.force_submit')
	var signinFormReqRes = $('.signin.popap .req_res')
	signinButton.on({
		click: function(e) {
			e.stopImmediatePropagation()
			e.preventDefault();
			$(this).parent().toggleClass('active').siblings().removeClass('active')

			return false
		}
	})
	signinSubmitButton.on({
		click: function(e) {
			e.preventDefault();
			e.stopImmediatePropagation()
			console.log('clicked signinSubmitButton')
			signinForm.submit();
		}
	})
	signinForm.submit(function(e) {
		e.preventDefault()
		console.log(signinForm.serializeObject())
		$.ajax({
			url: '/signin',
			type: 'POST',
			data: {
				query: signinForm.serializeObject()
			}
		})
		.done(function(res) {
			console.log('res data:', res)
			if (!res.success) {
				if (res.err.code) {
					switch (res.err.code) {
						case 11000 :
						signinFormReqRes.removeClass('success').addClass('error').html('Такой пользователь уже зарегистрирован!')
						break
					}
				} else {
					signinFormReqRes.removeClass('success').addClass('error').html('Не удалось войти, попробуйте еще разок')
				}
			} else {
				if (res.data === null){
					signinFormReqRes.removeClass('success').addClass('error').html('Пользователь не найден')
				} else {
					signinFormReqRes.removeClass('error').addClass('success').html('Успешный вход!')
					$('body').addClass('authorised')
					$('body.authorised .register .signin.item.active').on({
						mouseleave: function() {
							$(this).removeClass('active')
						}
					})
				}
			}

		})
		.fail(function(err) {
			console.log()
			console.log('error',err);
		})
		.always(function() {
			console.log("complete");
		});  
	})
});
// ------------- END SIGNIN

// ------------- SIGNOUT
var $signOutButton = $('.register .signout.item .link')
$signOutButton.on({
	click: function(e) {
		e.preventDefault();
		$('.register .login.item').unbind('mouseleave')
		$('.register .signin.item').unbind('mouseleave')
		$('body').removeClass('authorised')
		$('.req_res').attr('class','req_res').html('')
		$.post('/signout').then(function() {
			window.location.reload()
		})
	}
})

// ------------- END SIGNOUT

// ------------- SPINNER OPTIONS
$(function() {
	var opts = {
		target : document.getElementsByClassName('content_main')[0],
		lines: 17, // The number of lines to draw
		length: 40, // The length of each line
		width: 2, // The line thickness
		radius: 19, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 89, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: 'lightblue', // #rgb or #rrggbb or array of colors
		speed: 1.3, // Rounds per second
		trail: 49, // Afterglow percentage
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: 'auto', // Top position relative to parent in px
		left: 'auto' // Left position relative to parent in px
	};
	spinner = new Spinner(opts)
	spinner.spin(opts.target); 
	spinner.el.style.top = spinner.el.offsetTop - 70 + 'px';
})

// DROPZONE OPTIONS
var tFile;
var drop = $('.user_photo_container')[0]
var $userPhoto = $('.user_photo_container img').eq(0)
var usserPhotoDropzone = new Dropzone(drop, { 
	url: "/uploader",
	uploadMultiple: false,
	autoProcessQueue: false,
	acceptedFiles: "image/*",
	createImageThumbnails: true,
	thumbnailWidth: 600,
	thumbnailHeight: 800,
	paramName: 'userPhoto',
	clickable: '.user_photo_container, .user_photo',
	resize: function (file) {
		var info, srcRatio, trgRatio;
		var thumbnailWidth = this.options.thumbnailWidth
		var thumbnailHeight = this.options.thumbnailHeight
		info = {
			srcX: 0,
			srcY: 0,
			srcWidth: file.width,
			srcHeight: file.height,
			trgWidth: file.width,
			trgHeight: file.height
		};

		if (file.width < thumbnailWidth ) {
			console.log('ширина меньше')
			info.trgWidth = this.options.thumbnailWidth
			info.trgHeight = file.height * (this.options.thumbnailWidth / file.width)
		} else {
			console.log('ширина больше')
			info.trgWidth = this.options.thumbnailWidth
			info.trgHeight = file.height * (this.options.thumbnailWidth / file.width)
		}
		info.srcX = (file.width - info.srcWidth) / 2;
		info.srcY = (file.height - info.srcHeight) / 2;
		console.log(info)
		return info;
	} ,
	thumbnail: function(file, dataUrl) {
		tFile = file
		this.currentPhotoDataUrl = dataUrl
		console.log(this)
		console.log('thumbnail')
		$userPhoto.attr({
			'src': dataUrl,
			'width': '',
			'height': ''
		});
		// $.ajax({
		// 	url: '/uploader',
		// 	type: 'POST',
		// 	data: { userPhoto: dataUrl },
		// 	success: function() {console.log('success')},
		// 	error: function() {console.log('error')}
		// }).then(function() {
		// 	usserPhotoDropzone.removeAllFiles()
		// });
		console.log(this)
		console.log(dataUrl);
	},
	addedfile: function(file) {console.log('Dropzone: addedfile!' )},
	removedfile: function(file) {console.log('Dropzone: removedfile!' )},
	selectedfiles: function(file) {console.log('Dropzone: selectedfiles!' )},
	error: function(file) {console.log('Dropzone: error!' )},
	processing: function(file) {console.log('Dropzone: processing!' )},
	uploadprogress: function(file) {console.log('Dropzone: uploadprogress!' )},
	sending: function(file) {console.log(this.options.sending)},
	success: function(file) {console.log('Dropzone: success!')},
	complete: function(file) {		
		// if (file.xhr.status === 200 && file.xhr.statusText == "OK") {
		// 	console.log('Dropzone: complete!',file.xhr.responseText )
		// 	// $userPhoto.attr({
		// 	// 	'src': file.xhr.responseText,
		// 	// 	'width': '',
		// 	// 	'height': ''
		// 	// })
		// } else {
		// 	alert(file.xhr.responseText)
		// }
	},
	canceled: function(file) {console.log('Dropzone: canceled!' )},
	maxfilesreached: function(file) {console.log('Dropzone: maxfilesreached!' )},
	maxfilesexceeded: function(file) {console.log('Dropzone: maxfilesexceeded!' )},
	dictDefaultMessage : 'НЕОБХОДИМО ВПИСАТЬ ТЕКСТ! 1',
	dictFallbackMessage : 'Браузер не поддерживает отправку файлов с помощью drug`n`drop',
	dictFallbackText : 'Будет использована стандартная фарма отправки.',
	dictInvalidFileType : 'НЕОБХОДИМО ВПИСАТЬ ТЕКСТ! 4',
	dictFileTooBig : 'НЕОБХОДИМО ВПИСАТЬ ТЕКСТ! 5',
	dictResponseError : 'НЕОБХОДИМО ВПИСАТЬ ТЕКСТ! 6',
	dictCancelUpload : 'НЕОБХОДИМО ВПИСАТЬ ТЕКСТ! 7',
	dictCancelUploadConfirmation : 'НЕОБХОДИМО ВПИСАТЬ ТЕКСТ! 8',
	dictRemoveFile : 'НЕОБХОДИМО ВПИСАТЬ ТЕКСТ! 9',
	dictMaxFilesExceeded : 'НЕОБХОДИМО ВПИСАТЬ ТЕКСТ! 10',
	forceFallback: false,
	fallback: function(e) {

// TODO ПРИДУМАТЬ КАК ВЗЯТЬ ПОЛУЧИВШИЙСЯ НА СЕРВЕРЕ SRC КАРТИНКИ!!!

		console.log('Браузер не поддерживает DropZone, fallback')
		//-----------------------
		var child, messageElement, span, _i, _len, _ref;
		this.element.className = "" + this.element.className + " dz-browser-not-supported";
		_ref = this.element.getElementsByTagName("div");
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			child = _ref[_i];
			if (/(^| )dz-message($| )/.test(child.className)) {
				messageElement = child;
				child.className = "dz-message";
				continue;
			}
		}
		if (!messageElement) {
			messageElement = Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");
			this.element.appendChild(messageElement);
		}
		span = messageElement.getElementsByTagName("span")[0];
		if (span) {
			span.textContent = this.options.dictFallbackMessage;
		}
		fallbackForm = this.getFallbackForm()
		fallbackForm.elements[0].removeAttribute('undefined')
		fallbackForm.elements[0].setAttribute('disabled','disabled')
		fallbackForm.elements[1].setAttribute('disabled','disabled')
		return this.element.appendChild(fallbackForm);
		
		//-----------------------
	}
});
if (typeof usserPhotoDropzone.disable === 'function') {
	usserPhotoDropzone.disable();
}


// END DROPZONE OPTIONS

// ------------- VIEW OPTIONS
$(function() {
	function viewFix() {
		$('.content_main:first').height($(window).height() - 116 )
	};
	$(window).resize(function(){
		viewFix()
	})
	viewFix()
})
// ------------- END VIEW OPTIONS

// ------------- IF ERROR
$(function() {
	var myMap = {}
	if (typeof ymaps == "undefined") {
		spinner.stop();
		var noMap = document.getElementById('map')
		noMap.innerHTML = "<div class='no_internet'>Похоже, у вас проблемы с интернетом.<br> Яндекс.Карты , на которых построен этот сайт, не работают в таких условиях.</div>"
	} else {
            // Загружаем точки карты
            markers = [];

            $.post('/getmarks',function( res ){ 

            	markers = res.data
            	console.log(markers)
            }).then(function() {
            	ymaps.ready(init);
            },function() {
            	alert('не удалось загрузить отметки карты')
            	ymaps.ready(init);
            })
        }
    })
// ------------- END IF ERROR

// InitUserPage


// $mainContent.on('click','.userpage.item .show_userpage.link',function(e) {
// 	e.preventDefault()
// 	$mainContent.addClass('user_page_showed')
// })

// END InitUserPage

$(function() {

	var $mainContent 		= 	$('.content_main')
	var $userPageWrapper 	= 	$mainContent.find('.wrapper_left');
	var $userPage 			= 	$userPageWrapper.find('.user_page')
	var $userInfoForm		=	$userPage.find('#userInfo')
	var $userInfoList		=	$userPage.find('.user_info_container .user_info_list')
	var $userInfoListAllItems =	$userInfoList.find('.user_info_content')
	// user infolist items
	var $userName			=	$userPage.find('.user_name')
	var $userPhoto			=	$userPage.find('.user_photo_container .user_photo')
	var $userPhone			=	$userInfoList.find('.user_phone')
	var $userEmail			=	$userInfoList.find('.user_email')
	var $userAge			=	$userInfoList.find('.user_age')
	var $userType			=	$userInfoList.find('.user_type')
	var $userChars			=	$userInfoList.find('.user_chars')
	var $userMainPhrase 	=	$userInfoList.find('.user_main_phrase')
	var $userAboutMyself	=	$userInfoList.find('.user_about_myself')
	var $userIdol			=	$userInfoList.find('.user_idol')
	var $userAchieves		=	$userInfoList.find('.user_achievs')
	// controls
	var $linkToMyPage		=	$('.mypage.item .show_userpage.link')
	var $buttonEditSave		=	$userPage.find('.edit_button'); $buttonEditSave.detach();
	var $buttonCloseUserPage= 	$userPageWrapper.find('.close')
	var $buttonEditMyPage	=	$('.edit_my_page')
	var $buttonSaveMyPage	=	$('.save_my_page')
	var $fallbackFormInputs =	$('.dz-browser-not-supported .dz-fallback input')

	// functions
	var substituteVars = function(data) {
		console.log(data)
		if (data['name'] !== undefined) 		$userName			.html(data['name'])
		if (data['photo'] !== undefined) 		$userPhoto			.attr('src', data['photo'])
		if (data['phone'] !== undefined) 		$userPhone			.val(data['phone'])
		if (data['email'] !== undefined) 		$userEmail			.val(data['email'])
		if (data['type'] !== undefined) 		$userType			.val(data['type'])
		if (data['age'] !== undefined) 			$userAge			.val(data['age'])
		if (data['chars'] !== undefined) 		$userChars			.val(data['chars'])
		if (data['main-phrase'] !== undefined) 	$userMainPhrase		.val(data['main-phrase'])
		if (data['about-myself'] !== undefined) $userAboutMyself	.val(data['about-myself'])
		if (data['my-idol'] !== undefined) 		$userIdol			.val(data['my-idol'])
		if (data['achieves'] !== undefined) 	$userAchieves		.text(data['achieves'])	
	};
	var showMyPage = function(id) {
		// e.preventDefault()
		console.log('showMyPage: ',id)
		$buttonEditSave.appendTo($userPage.find('.user_page_right'))
		$this = $(this)
		$.ajax({
			url: '/user',
			type: 'POST',
			headers: {
				'Cache-Control': 'public, max-age=15768000000' 
			},
			data: {  query : 
				{
					id: 'current_user'
				} 
			},
			success: substituteVars,
			error: function(err) {
				window.location.reload()
			},
			complite: function() {}
		}).then(function(err) {
				if (err) {
					console.log(err)
				}
				$mainContent.addClass('user_page_showed')

		},function() {})
	};
	var editMyPage = function(e) {
		console.log('edit my page!')
		$(this).attr('class','edit_button save_my_page').text('Сохранить');
		$userInfoListAllItems.prop('disabled', false).addClass('editable')
		$userAchieves.css('resize','vertical')
		if (usserPhotoDropzone.element) {
			usserPhotoDropzone.enable();
		} else {
			$fallbackFormInputs.prop('disabled', false)
		}
	};
	var saveMyPage = function(e) {
		console.log('saveMyPage')
		$(this).attr('class','edit_button edit_my_page').text('Редактировать');

		if (usserPhotoDropzone.currentPhotoDataUrl) {
			$.ajax({
				url: '/uploader',
				type: 'POST',
				data: { userPhoto: usserPhotoDropzone.currentPhotoDataUrl },
				success: function(data) {console.log('success')},
				error: function(err) {console.log('error', err)}
			}).then(function() {
				usserPhotoDropzone.removeAllFiles()
			});
		}

		$.ajax({
			url: '/user-update',
			type: 'POST',
			data: { data: $userInfoForm.serializeObject() },
			success: function(data) {console.log('success')},
			error: function(err) {console.log('error', err)}
		}).then(function() {});


		$userInfoListAllItems.prop('disabled', true).removeClass('editable')
		$userAchieves.css('resize','none')
		if ( usserPhotoDropzone.element ) {
			usserPhotoDropzone.disable();
		} else {
			$fallbackFormInputs.prop('disabled', true)
		}
		console.log('page saved!')
	};
	var loadUserPage = function(e) {
		e.preventDefault()
		$this = $(this)
		$.ajax({
			url: '/user',
			type: 'POST',
			headers: {
				'Cache-Control': 'public, max-age=15768000000' 
			},
			data: {  query : 
				{
					id: $this.data('userid')
				} 
			},
			success: substituteVars,
			error: function(err) {},
			complite: function() {}
		})
	};
	var showUserPage = function(e) {
		// e.preventDefault();
		$('.wrapper_left .user_page').imagesLoaded()
		.always( function( instance ) {
			console.log('all images loaded');
		})
		.done( function( instance ) {
			console.log('all images successfully loaded');
			$mainContent.addClass('user_page_showed')
		})
		.fail( function() {
			console.log('all images loaded, at least one is broken');
		})
		.progress( function( instance, image ) {
			var result = image.isLoaded ? 'loaded' : 'broken';
			console.log( 'image is ' + result + ' for ' + image.img.src );
		});
	}
	var closeUserPage = function(e) {
		$buttonEditSave.detach();
		$mainContent.removeClass('user_page_showed')
	}

	$buttonCloseUserPage.on('click', closeUserPage)

	$(window).on({
		'keydown': function(e) {
			// console.log('keydown: ',e)
			switch (e.keyCode) {
				case 9:
					e.preventDefault();
				break
			} 
		},
		'keyup': function(e) {
			// console.log('keyup: ',e)
			switch (e.keyCode) {
				case 27:
					console.log('escape')
					e.preventDefault()
					$buttonCloseUserPage.trigger('click')
				break
				case 13:
					console.log('enter')
					if ($mainContent.hasClass('user_page_showed') && typeof $('.user_page .save_my_page') !== undefined && $(e.srcElement).hasClass('user_info_content')) {
						$('.user_page .save_my_page').trigger('click')
					}
				break	
			}
		}
	})
	// show my page
	// $linkToMyPage.on('click', showMyPage)
	// show user page
	$('#map').on('click', '.instructor_in_dropdown .load_info' , loadUserPage)
	// $('#map').on('click', '.instructor_in_dropdown .main_user_link' , showUserPage)
	// edit/save user page
	$userPage.on('click','.edit_my_page', editMyPage)
	$userPage.on('click','.save_my_page', saveMyPage)

	// BACKBONE
	$('body').prepend('<div id="app"></div>')
	var AppRouter = Backbone.Router.extend({
		routes: {
			"(/)": "root",
			"mypage": "userPage",
			"mypage/:id": "mypage",
			"instructors": "itemForm",
			"instructors/:id": "userPage",
			"clients": "itemForm",
			"resorts": "itemForm",
			"contacts": "itemForm",
		},
		root: function () {
			$('#app').html('Home');
			closeUserPage()
		},

		userPage:function(id) {
			$('#app').html('User Page, id: ' + id);
			showUserPage(id)
		},

		mypage: function(id) {
			console.log('route mypage: ', id)
			$('#app').html('My Page, id: ' + id);
			showMyPage(id)
		},
		

		itemDetails: function (item) {
			console.log(typeof item)
			$('#app').html('Menu item: ' + item);
		},

		itemForm: function () {
			$('#app').html('New item form');
		}
	});

	var app = new AppRouter();

	$(function() {
		Backbone.history.start();
	});

	// END BACKBONE

})




