
// TODO
// Добавить кнопку возврата в исходное положение ( центр карты и масштаб )
// Поправить кнопку определения местаположения 
var myMap = {}
ymaps.ready(init);

function init() {
		// Создание экземпляра карты.
		myMap = new ymaps.Map('map', {
			center: [59.95, 30.316667],
			zoom: 14,
			type: 'yandex#publicMap',
			behaviors: ['default']
		})

		spinner.stop();
		$('.ymaps-map.ymaps-i-ua_js_yes', '#map').ready(function() {
			setTimeout(function() {
				myMap.center = myMap.getCenter();
				myMap.zoom = myMap.getZoom();
				$('.ymaps-map.ymaps-i-ua_js_yes', '#map').addClass('visible')
			}, 300);
		})
	// Контейнер для меню.
	var menu = $('<ul class="menu"/>');

	console.log(myMap)
	myMap.container.fitToViewport();

	var hostName = 'http://' + window.location.host + '/'
	var baseImageURL = 'img/';
	
	var bindOperators =  function() {
		$(document).delegate('.instructors_dropdown .js_showSubmenu', 'click', function(e) {
			e.preventDefault()
			console.log(e.srcElement)
			console.log($(this))
			$(this).parent().toggleClass('active').siblings().removeClass('active')
		});
	};
	bindOperators();

	// center button
	var centerBtn = $('<div class="map_btn_wrapper btn_center"><ymaps class="ymaps-b-form-button ymaps-b-form-button_theme_grey-no-transparent-26 ymaps-b-form-button_height_26 ymaps-i-bem" role="button" unselectable="on" style="-webkit-user-select: none;"><ymaps class="ymaps-b-form-button__left"></ymaps><ymaps class="ymaps-b-form-button__content"><ymaps class="ymaps-b-form-button__text"><ymaps id="" unselectable="on" style="-webkit-user-select: none;"><ymaps><ymaps class="ymaps-b-select__title" style="display: block;">Высставить как было!</ymaps></ymaps></ymaps></ymaps></ymaps></ymaps></div>');
	$('#map').append(centerBtn);
	$('#map .btn_center .ymaps-b-form-button').click(function () {
		myMap.setBounds(myMap.geoObjects.getBounds(),{
			duration:500
		});
	})
	// END center button

	// GeolocationButton
	/**
	 * Класс кнопки определения местоположения пользователя.
	 * с помощью Geolocation API.
	 * @see http://www.w3.org/TR/geolocation-API/
	 * @class
	 * @name GeolocationButton
	 * @param {Object} params Данные для кнопки и параметры к Geolocation API.
	 */
	 function GeolocationButton(params) {
	 	GeolocationButton.superclass.constructor.call(this, params);

		// Расширяем опции по умолчанию теми, что передали в конструкторе.
		this.geoLocationOptions = ymaps.util.extend({
			// Не центрировать карту.
			noCentering: true,
			// Не ставить метку.
			noPlacemark: false,
			// Не показывать точность определения местоположения.
			noAccuracy: false,
			// Режим получения наиболее точных данных.
			enableHighAccuracy: true,
			// Максимальное время ожидания ответа (в миллисекундах).
			timeout: 10000,
			// Максимальное время жизни полученных данных (в миллисекундах).
			maximumAge: 1000
		}, params.options);
	}
	ymaps.util.augment(GeolocationButton, ymaps.control.Button, {
		/**
		 * Метод будет вызван при добавлении кнопки на карту.
		 * @function
		 * @name GeolocationButton.onAddToMap
		 * @param {ymaps.Map} map Карта на которую добавляется кнопка.
		 */
		 onAddToMap: function (map, position) {
		 	GeolocationButton.superclass.onAddToMap.apply(this, arguments);

		 	// ymaps.option.presetStorage.add('geolocation#icon', {
		 	// 	iconImageHref: 'man.png',
		 	// 	iconImageSize: [100, 100 ],
		 	// 	iconImageOffset: [0, -24]
		 	// });
console.log(this.options)
this.hint = new GeolocationButtonHint(this);
			// Обрабатываем клик на кнопке.
			this.events.add('click', this.onGeolocationButtonClick, this);
		},
		/**
		 * Метод будет вызван при удалении кнопки с карты.
		 * @function
		 * @name GeolocationButton.onRemoveFromMap
		 * @param {ymaps.Map} map Карта с которой удаляется кнопка.
		 */
		 onRemoveFromMap: function () {
		 	this.events.remove('click', this.onGeolocationButtonClick, this);
		 	this.hint = null;
		 	ymaps.option.presetStorage.remove('geolocation#icon');

		 	GeolocationButton.superclass.onRemoveFromMap.apply(this, arguments);
		 },
		/**
		 * Обработчик клика на кнопке.
		 * @function
		 * @private
		 * @name GeolocationButton.onGeolocationButtonClick
		 * @param {ymaps.Event} e Объект события.
		 */
		 onGeolocationButtonClick: function (e) {
			// Меняем иконку кнопки на прелоадер.
			this.toggleIconImage('loader.gif');

			// Делаем кнопку ненажатой
			if (this.isSelected()) {
				this.deselect();
			}

			if (navigator.geolocation) {
				// Запрашиваем текущие координаты устройства.
				navigator.geolocation.getCurrentPosition(
					ymaps.util.bind(this._onGeolocationSuccess, this),
					ymaps.util.bind(this._onGeolocationError, this),
					this.geoLocationOptions
					);
			} else {
				this.handleGeolocationError('Ваш броузер не поддерживает GeolocationAPI.');
			}
		},
		/**
		 * Обработчик успешного завершения геолокации.
		 * @function
		 * @private
		 * @name GeolocationButton._onGeolocationSuccess
		 * @param {Object} position Объект, описывающий текущее местоположение.
		 */
		 _onGeolocationSuccess: function (position) {
		 	this.handleGeolocationResult(position);
			// Меняем иконку кнопки обратно
			this.toggleIconImage('wifi.png');
		},
		/**
		 * Обработчик ошибки геолокации.
		 * @function
		 * @name GeolocationButton._onGeolocationError
		 * @param {Object} error Описание причины ошибки.
		 */
		 _onGeolocationError: function (error) {
		 	this.handleGeolocationError('Точное местоположение определить не удалось.');
			// Меняем иконку кнопки обратно.
			this.toggleIconImage('wifi.png');

			if (console) {
				console.warn('GeolocationError: ' + GeolocationButton.ERRORS[error.code - 1]);
			}
		},
		/**
		 * Обработка ошибки геолокации.
		 * @function
		 * @name GeolocationButton.handleGeolocationError
		 * @param {Object|String} err Описание ошибки.
		 */
		 handleGeolocationError: function (err) {
		 	this.hint
		 	.show(err.toString())
		 	.hide(2000);
		 },
		/**
		 * Меняет иконку кнопки.
		 * @function
		 * @name GeolocationButton.toggleIconImage
		 * @param {String} image Путь до изображения.
		 */
		 toggleIconImage: function (image) {
		 	this.data.set('image', baseImageURL + image);
		 },
		/**
		 * Обработка результата геолокации.
		 * @function
		 * @name GeolocationButton.handleGeolocationResult
		 * @param {Object} position Результат геолокации.
		 */
		 handleGeolocationResult: function (position) {
		 	var location = [position.coords.latitude, position.coords.longitude],
		 	accuracy = position.coords.accuracy,
		 	map = this.getMap(),
		 	options = this.geoLocationOptions,
		 	placemark = this._placemark,
		 	circle = this._circle;

			// Смена центра карты (если нужно)
			if (!options.noCentering) {
				map.setCenter(location, 15);
			}

			// Установка метки по координатам местоположения (если нужно).
			if (!options.noPlacemark) {
				// Удаляем старую метку.
				if (placemark) {
					map.geoObjects.remove(placemark);
				}
				this._placemark = placemark = new ymaps.Placemark(location, {}, {
					preset: 'twirl#redIcon'
				});
				map.geoObjects.add(placemark);
				// Показываем адрес местоположения в хинте метки.
				this.getLocationInfo(placemark);
			}

			// Показываем точность определения местоположения (если нужно).
			if (!options.noAccuracy) {
				// Удаляем старую точность.
				if (circle) {
					map.geoObjects.remove(circle);
				}
				this._circle = circle = new ymaps.Circle([location, accuracy], {}, {
					opacity: 0.5
				});
				map.geoObjects.add(circle);
			}
		},
		/**
		 * Получение адреса по координатам метки.
		 * @function
		 * @name GeolocationButton.getLocationInfo
		 * @param {ymaps.Placemark} point Метка для которой ищем адрес.
		 */
		 getLocationInfo: function (point) {
		 	ymaps.geocode(point.geometry.getCoordinates())
		 	.then(function (res) {
		 		var result = res.geoObjects.get(0);

		 		if (result) {
		 			point.properties.set('hintContent', result.properties.get('name'));
		 		}
		 	});
		 }
		});

	/**
	 * Человекопонятное описание кодов ошибок.
	 * @static
	 */
	 GeolocationButton.ERRORS = [
	 'permission denied',
	 'position unavailable',
	 'timeout'
	 ];

	/**
	 * Класс хинта кнопки геолокации, будем использовать для отображения ошибок.
	 * @class
	 * @name GeolocationButtonHint
	 * @param {GeolocationButton} btn Экземпляр класса кнопки.
	 */
	 function GeolocationButtonHint(btn) {
	 	var map = btn.getMap(),
			// Позиция кнопки.
			position = btn.options.get('position');

			this._map = map;
		// Отодвинем от кнопки на 35px.
		this._position = [position.left + 35, position.top];
	}

	/**
	 * Отображает хинт справа от кнопки.
	 * @function
	 * @name GeolocationButtonHint.show
	 * @param {String} text
	 * @returns {GeolocationButtonHint}
	 */
	 GeolocationButtonHint.prototype.show = function (text) {
	 	var map = this._map,
	 	globalPixels = map.converter.pageToGlobal(this._position),
	 	position = map.options.get('projection').fromGlobalPixels(globalPixels, map.getZoom());

	 	this._hint = map.hint.show(position, text);

	 	return this;
	 };
	/**
	 * Прячет хинт с нужной задержкой.
	 * @function
	 * @name GeolocationButtonHint.hide
	 * @param {Number} timeout Задержка в миллисекундах.
	 * @returns {GeolocationButtonHint}
	 */
	 GeolocationButtonHint.prototype.hide = function (timeout) {
	 	var hint = this._hint;

	 	if (hint) {
	 		setTimeout(function () {
	 			hint.hide();
	 		}, timeout);
	 	}

	 	return this;
	 };

	 var myButton = new GeolocationButton({
	 	data: {
	 		image: baseImageURL + 'wifi.png',
	 		title: 'Определить местоположение'
	 	},
	 	options: {
			// Режим получения наиболее точных данных.
			enableHighAccuracy: true
		}
	});
	// END GeolocationButton


	// Перебираем все группы.
	groups.forEach(function (group) {
		// Пункт меню.
		var menuItem = $('<li><a href="#">' + group.name + '</a></li>'),
			// Коллекция для геообъектов группы.
			collection = new ymaps.GeoObjectCollection(null, {
				preset: group.style
			}),
			// Контейнер для подменю.
			submenu = $('<ul class="submenu"/>');

		// Добавляем коллекцию на карту.
		myMap.geoObjects.add(collection);

		// Добавляем подменю.
		menuItem
		.append(submenu)
		// Добавляем пункт в меню.
		.appendTo(menu)
		// По клику удаляем/добавляем коллекцию на карту и скрываем/отображаем подменю.
		.find('a')
		.toggle(function () {
			myMap.geoObjects.remove(collection);
			submenu.hide();
		}, function () {
			myMap.geoObjects.add(collection);
			submenu.show();
		});

		// Перебираем элементы группы.
		group.items.forEach(function (item) {
			// Пункт подменю.
			var submenuItem = $('<li><a href="#">' + item.name + '</a></li>'),
				// Создаем метку.
				placemark = new ymaps.Placemark(item.cords, {
					iconContent: item.iconContent,
					hintContent: item.hintContent,
					balloonContent: item.balloonContent
				}, {
					preset: group.style
				});

				placemark.events.add('balloonopen', function (e) {
					console.log(e)
					placemark.properties.set('balloonContent', "Идет загрузка данных...")

					var result = '';
					$.ajax({
						url: '/getall',
						type: 'POST',
						data: {param1: 'value1'},
						success: function (res) {
							console.log('success')
							console.log('req data :', this.data);
							console.log('res data :', res.data)
							var instructorsList = res.data;
							result += '<ul class="instructors_dropdown">'
							if (instructorsList.length < 1) { result = 'Никого нет' }
							for (var i = 0; i < instructorsList.length; i++) {
								console.log(instructorsList[i])
								result += '<li class="instructor_in_dropdown"><a class="js_showSubmenu" href="/' + instructorsList[i]['имя'] + '">' + instructorsList[i]['имя'] + '</a><ul class="js_submenu hidden">'
								for (prop in instructorsList[i]) {
									if (
										prop != '_id' &&
										prop != 'pass' &&
										prop != 'pass_check' &&
										prop != '__v'
										) {
										result += '<li>' + prop + ': ' + instructorsList[i][prop] + '</li>'
								}
							}
							result += '</ul></li>'
						}
						result += '</ul>'
						placemark.properties.set('balloonContent', result);
					},
					error: function() {
						console.log("error");
					},
					complete: function() {
						console.log("complete");
					}
				})
})

			// Добавляем метку в коллекцию.
			collection.add(placemark);
			// Добавляем пункт в подменю.
			submenuItem
			.appendTo(submenu)
			// При клике по пункту подменю открываем/закрываем баллун у метки.
			.find('a')
			.toggle(function () {
				placemark.balloon.open();
			}, function () {
				placemark.balloon.close();
			});
		});
});

	// Добавляем меню в тэг BODY.
	menu.appendTo($('body > .content'));
	// Выставляем масштаб карты чтобы были видны все группы.
	myMap.setBounds(myMap.geoObjects.getBounds());

	var initUserTemplates = function() {
		var MyBalloonAccordionClass = ymaps.templateLayoutFactory.createClass(
			'<h3>Макет</h3><p>Создан на основе шаблона.</p>' 
			);
	};
	initUserTemplates();

	(function initControls() {


		var myListBox = new ymaps.control.ListBox({
			data: {
				title: 'Выбрать город'
			},
			items: [
			new ymaps.control.ListBoxItem('Москва'),
			new ymaps.control.ListBoxItem('Новосибирск'),
			new ymaps.control.ListBoxSeparator(),
			new ymaps.control.ListBoxItem('Нью-Йорк')
			]
		});
		myMap.controls.add('mapTools');
		myMap.controls.add('zoomControl', {
			top: 70,
			left: 8
		});
		myMap.controls.add('routeEditor');
		// myMap.controls.add('searchControl'); создать пользовательский шаблон
		myMap.controls.add(myListBox);
		myMap.controls.add(myButton, {
			top: 37,
			left: 5
		});
	})()
}