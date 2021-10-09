﻿#Область ОбработчикиСобытийФормы

&НаСервере
Процедура ПриСозданииНаСервере(Отказ, СтандартнаяОбработка)
	
	Для Каждого Уровень Из ЛК_ОбменДаннымиПовтИсп.УровниЛога()  Цикл
		Элементы.УровеньЛогирования.СписокВыбора.Добавить(Уровень.Ключ);	
	КонецЦикла;
	
	УстановитьДоступностьЭлементовФормы();
	
КонецПроцедуры

&НаСервере
Процедура ПослеЗаписиНаСервере(ТекущийОбъект, ПараметрыЗаписи)
	
	ОбновитьПовторноИспользуемыеЗначения();
	
КонецПроцедуры

#КонецОбласти  

#Область ОбработчикиКомандФормы

&НаКлиенте
Процедура ПроверитьПодключение(Команда)

	Если ПроверитьПодключениеНаСервере() Тогда 
		ОбщегоНазначенияКлиентСервер.СообщитьПользователю("Связь установлена!");
	Иначе 
		ОбщегоНазначенияКлиентСервер.СообщитьПользователю("Связь не установлена!");
	КонецЕсли;	
	
КонецПроцедуры

&НаКлиенте
Процедура Инициализировать(Команда) 
	
	Если Модифицированность Тогда
		ОбщегоНазначенияКлиентСервер.СообщитьПользователю("Сначала необходимо записать элемент!");
	Иначе	  
		
	   	ОбщегоНазначенияКлиентСервер.СообщитьПользователю("Начата регистрация элементов для обмена.");
		ЗарегистрироватьЭлементыДляОбмена();  
		
		ОбщегоНазначенияКлиентСервер.СообщитьПользователю("Начат обмен."); 
		ВыполнитьОбменаНаСервере();
		ОбщегоНазначенияКлиентСервер.СообщитьПользователю("Обмен закончен."); 
		
	КонецЕсли;	
	
КонецПроцедуры

#КонецОбласти 

#Область СлужебныеПроцедурыИФункции

&НаСервере
Процедура ВыполнитьОбменаНаСервере()
	
	ЛК_ОбменДаннымиСервер.ВыполнитьОбмен(Истина);
	
КонецПроцедуры	

&НаСервере
Процедура ЗарегистрироватьЭлементыДляОбмена()

	НовыйЭлемент = Справочники.ЛК_СтатусыЗаявокНаСправки.СоздатьЭлемент();
	НовыйЭлемент.Наименование = "Новый";
	НовыйЭлемент.Код = 2;
	НовыйЭлемент.Записать();
	
	НовыйЭлемент = Справочники.ЛК_СтатусыЗаявокНаСправки.СоздатьЭлемент();
	НовыйЭлемент.Наименование = "В работе";
	НовыйЭлемент.Код = 3;
	НовыйЭлемент.Записать();

	НовыйЭлемент = Справочники.ЛК_СтатусыЗаявокНаСправки.СоздатьЭлемент();
	НовыйЭлемент.Наименование = "Отменена";
	НовыйЭлемент.Код = 4;
	НовыйЭлемент.Записать();
	
	НовыйЭлемент = Справочники.ЛК_СтатусыЗаявокНаСправки.СоздатьЭлемент();
	НовыйЭлемент.Наименование = "Выполнена";
	НовыйЭлемент.Код = 5;
	НовыйЭлемент.Записать();
	
	НовыйЭлемент = Справочники.ЛК_ТипыСправок.СоздатьЭлемент();
	НовыйЭлемент.Наименование = "НДФЛ";
	НовыйЭлемент.Код = 1;
	НовыйЭлемент.Записать();
	
	Выборка = Справочники.ВидыИспользованияРабочегоВремени.Выбрать();
	Пока Выборка.Следующий() Цикл 
		ЛК_ОбработкаСобытийСервер.ЗарегистрироватьЗаписьСсылочногоОбъекта(Выборка.Ссылка, Истина);
	КонецЦикла;	
	
	Выборка = Справочники.ГрафикиРаботыСотрудников.Выбрать();
	Пока Выборка.Следующий() Цикл 
		
		ЛК_ОбработкаСобытийСервер.ЗарегистрироватьЗаписьСсылочногоОбъекта(Выборка.Ссылка, Истина);
		
		Запрос = Новый Запрос;
		Запрос.Текст =" 
		|ВЫБРАТЬ РАЗЛИЧНЫЕ
		|	ГрафикиРаботыПоВидамВремени.Месяц КАК Месяц,
		|	ГрафикиРаботыПоВидамВремени.ГрафикРаботы КАК ГрафикРаботы
		|ИЗ
		|	РегистрСведений.ГрафикиРаботыПоВидамВремени КАК ГрафикиРаботыПоВидамВремени
		|ГДЕ
		|	ГрафикиРаботыПоВидамВремени.ГрафикРаботы = &ГрафикРаботы
		|
		|УПОРЯДОЧИТЬ ПО
		|	Месяц
		|";
		Запрос.Параметры.Вставить("ГрафикРаботы", Выборка.Ссылка); 
		
		ВыборкаЗапроса =  Запрос.Выполнить().Выбрать();
		
		ТипОбъекта	= ЛК_ОбменДаннымиПовтИсп.ТипыОбъектов().РСНЗ;
		ИмяОбъекта = "ГрафикиРаботыПоВидамВремени";

		
		Пока ВыборкаЗапроса.Следующий() Цикл 
			
			Структура = Новый Структура;
			Структура.Вставить("ГрафикРаботы",     Выборка.Ссылка);
			Структура.Вставить("Месяц",            ВыборкаЗапроса.Месяц);
			
			ДанныеJSON = ЛК_РаботаСJSONСервер.ЗаписьJSON(Структура);	
			
			ХешированиеДанных  = Новый ХешированиеДанных (ХешФункция.CRC32);
			ХешированиеДанных.Добавить(ДанныеJSON);
			ХешСумма = ХешированиеДанных.ХешСумма;
			
			РегистрыСведений.ЛК_ОчередьОбменаСЛКПроизвольнымиДанными.ЗарегистрироватьДобавлениеОбъекта(ТипОбъекта, ИмяОбъекта, ХешСумма, ДанныеJSON);
			
		КонецЦикла;
		
	КонецЦикла;	
	
	Запрос = Новый Запрос;
	Запрос.Текст = "ВЫБРАТЬ
					|	Организации.Ссылка КАК Ссылка
					|ИЗ
					|	Справочник.Организации КАК Организации";
				
	Выборка = Запрос.Выполнить().Выбрать();
	Пока Выборка.Следующий() Цикл
		ЛК_ОбработкаСобытийСервер.ЗарегистрироватьЗаписьСсылочногоОбъекта(Выборка.Ссылка, Истина);
	КонецЦикла;
	
	Запрос.Текст = "ВЫБРАТЬ
	               |	ПодразделенияОрганизаций.Ссылка КАК Ссылка
	               |ИЗ
	               |	Справочник.ПодразделенияОрганизаций КАК ПодразделенияОрганизаций";
	

	Выборка = Запрос.Выполнить().Выбрать();
	Пока Выборка.Следующий() Цикл
		ЛК_ОбработкаСобытийСервер.ЗарегистрироватьЗаписьСсылочногоОбъекта(Выборка.Ссылка, Истина);
	КонецЦикла;
	
	Запрос = Новый Запрос;
	Запрос.Текст = "ВЫБРАТЬ
	               |	Должности.Ссылка КАК Ссылка
	               |ИЗ
	               |	Справочник.Должности КАК Должности";

	Выборка = Запрос.Выполнить().Выбрать();
	Пока Выборка.Следующий() Цикл
		ЛК_ОбработкаСобытийСервер.ЗарегистрироватьЗаписьСсылочногоОбъекта(Выборка.Ссылка, Истина);
	КонецЦикла;       
	
	ЛК_ОбменДаннымиСервер.ВыполнитьОбмен();
	
КонецПроцедуры

&НаСервере
Функция ПроверитьПодключениеНаСервере()   
	
	НастройкиСервисаСтруктура = ЛК_РаботаСФункциямиКлиентСервер.СтруктураВозврата(); 
	
	СтруктураРезультата = Новый Структура("АдресСервера, ЛогинПользователя, ПарольПользователя, ИДБазы");
	СтруктураРезультата.АдресСервера       = Запись.АдресСервера; 
	СтруктураРезультата.ЛогинПользователя  = Запись.ЛогинПользователя;
	СтруктураРезультата.ПарольПользователя = Запись.ПарольПользователя;
	СтруктураРезультата.ИДБазы 			   = Запись.ИДБазы;
	
    ЛК_РаботаСФункциямиКлиентСервер.ДобавитьРезультат(НастройкиСервисаСтруктура, СтруктураРезультата);

	Если ЛК_РаботаСФункциямиКлиентСервер.Ошибка(НастройкиСервисаСтруктура) Тогда

		ЛК_РаботаСФункциямиКлиентСервер.СообщитьОбОшибках(НастройкиСервисаСтруктура);		
		Возврат Ложь;  
		
	КонецЕсли;
	
	НастройкиСервиса = ЛК_РаботаСФункциямиКлиентСервер.Результат(НастройкиСервисаСтруктура);
	
	ТокенСтруктура = ЛК_ОбменДаннымиСервер.Логин(НастройкиСервиса); 
	Если ЛК_РаботаСФункциямиКлиентСервер.Ошибка(ТокенСтруктура) Тогда
		
		ЛК_РаботаСФункциямиКлиентСервер.СообщитьОбОшибках(ТокенСтруктура);	
		Возврат Ложь; 
		
	КонецЕсли; 
	
	Возврат Истина;

КонецФункции

&НаСервере
Процедура УстановитьДоступностьЭлементовФормы()
	
	НайденныйЭлемент = Справочники.ЛК_СтатусыЗаявокНаСправки.НайтиПоКоду(2);
	Если ЗначениеЗаполнено(НайденныйЭлемент) Тогда
		Элементы.Инициализировать.Доступность = Ложь;
	Иначе 
		Элементы.Инициализировать.Доступность = Истина;
	КонецЕсли;	
	
КонецПроцедуры	

#КонецОбласти
