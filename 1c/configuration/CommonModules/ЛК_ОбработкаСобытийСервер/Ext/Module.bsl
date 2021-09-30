﻿#Область ПрограммныйИнтерфейс

Процедура ЗарегистрироватьЗаписьСсылочногоОбъекта(Объект, ЭтоНовый = Ложь) Экспорт
	
	Если Не (Справочники.ТипВсеСсылки().СодержитТип(ТипЗнч(Объект)) Или Документы.ТипВсеСсылки().СодержитТип(ТипЗнч(Объект)))
			И Объект.ДополнительныеСвойства.Свойство("НеРегистрироватьВОбмене") Тогда
		Возврат;
	КонецЕсли;	

	УстановитьПривилегированныйРежим(Истина);
	
	Если Не ЗначениеЗаполнено(ЛК_РаботаСФункциямиКлиентСервер.Результат(ЛК_ОбменДаннымиПовтИсп.НастройкиСервиса()).АдресСервера) Тогда
		Возврат;
	КонецЕсли; 
	
	Если ЭтоНовый = Неопределено И Не ЗначениеЗаполнено(Объект.Ссылка) Тогда
		
		ЭтоНовый = Истина;
		УстановитьПривилегированныйРежим(Ложь);
		Возврат
		
	ИначеЕсли ЭтоНовый = Истина Тогда	
		РегистрыСведений.ЛК_ОчередьОбменаСЛКСсылочнымиДанными.ЗарегистрироватьДобавлениеОбъекта(Объект.Ссылка);	
	Иначе
		РегистрыСведений.ЛК_ОчередьОбменаСЛКСсылочнымиДанными.ЗарегистрироватьИзменениеОбъекта(Объект.Ссылка);
	КонецЕсли;
	
	УстановитьПривилегированныйРежим(Ложь);
	
КонецПроцедуры

Процедура ЗарегистрироватьЗаписьРегистраСведений(НаборЗаписей) Экспорт  
	
	УстановитьПривилегированныйРежим(Истина);
	
	Если Не ЗначениеЗаполнено(ЛК_РаботаСФункциямиКлиентСервер.Результат(ЛК_ОбменДаннымиПовтИсп.НастройкиСервиса()).АдресСервера) Тогда
		Возврат;
	КонецЕсли; 
	
	МассивПользователейЛК = ЛК_ОбменДаннымиПовтИсп.МассивПользователейЛК();
	ТипОбъекта	= ЛК_ОбменДаннымиПовтИсп.ТипыОбъектов().РСНЗ;
	ИмяОбъекта = НаборЗаписей.Метаданные().Имя;
	
	Если ИмяОбъекта = "ФотографииФизическихЛиц" Тогда
		
		Объект1С = Новый Соответствие;

		//Удаление записи 
		Если НаборЗаписей.Количество() = 0 И НаборЗаписей.Отбор.ФизическоеЛицо.Использование И ЗначениеЗаполнено(НаборЗаписей.Отбор.ФизическоеЛицо.Значение) Тогда
			Если МассивПользователейЛК.Найти(НаборЗаписей.Отбор.ФизическоеЛицо.Значение) = Неопределено  Тогда
				Возврат;
			Иначе
				Объект1С.Вставить(НаборЗаписей.Отбор.ФизическоеЛицо.Значение);
			КонецЕсли;
		//Массовое удаление	
		ИначеЕсли НаборЗаписей.Количество() = 0 И Не НаборЗаписей.Отбор.ФизическоеЛицо.Использование Тогда
		
			Запрос = Новый Запрос;
			Запрос.Текст = "ВЫБРАТЬ
							|	ФотографииФизическихЛиц.ФизическоеЛицо КАК ФизическоеЛицо
							|ИЗ
							|	РегистрСведений.ФотографииФизическихЛиц КАК ФотографииФизическихЛиц
							|		ВНУТРЕННЕЕ СОЕДИНЕНИЕ РегистрСведений.ЛК_ПользователиЛК КАК ЛК_ПользователиЛК
							|	";

			Выборка = Запрос.Выполнить().Выбрать();
			Пока Выборка.Следующий() Цикл
				Объект1С.Вставить(Выборка.ФизическоеЛицо);
			КонецЦикла;
			
		//Добавление записей	
		Иначе	
		
			Для Каждого СтрокаНабора Из НаборЗаписей Цикл
				
				Если МассивПользователейЛК.Найти(СтрокаНабора.ФизическоеЛицо) <> Неопределено  Тогда
					Объект1С.Вставить(СтрокаНабора.ФизическоеЛицо);
				КонецЕсли;
				
			КонецЦикла;	
			
		КонецЕсли;
	ИначеЕсли ИмяОбъекта = "КадроваяИсторияСотрудников" Тогда
		
		Запрос = Новый Запрос;
		Запрос.Текст = "ВЫБРАТЬ РАЗРЕШЕННЫЕ
						|	КадроваяИсторияСотрудников.Сотрудник КАК Сотрудник,
						|	КадроваяИсторияСотрудников.ФизическоеЛицо КАК ФизическоеЛицо,
						|	КадроваяИсторияСотрудников.ВидСобытия КАК ВидСобытия
						|ИЗ
						|	РегистрСведений.ЛК_ПользователиЛК КАК ЛК_ПользователиЛК
						|		ВНУТРЕННЕЕ СОЕДИНЕНИЕ РегистрСведений.КадроваяИсторияСотрудников КАК КадроваяИсторияСотрудников
						|		ПО (КадроваяИсторияСотрудников.ФизическоеЛицо = ЛК_ПользователиЛК.ФизическоеЛицо)
						|ГДЕ
						|	КадроваяИсторияСотрудников.Регистратор = &Регистратор";
		
		Запрос.УстановитьПараметр("Регистратор", НаборЗаписей.Отбор.Регистратор.Значение);
		
		Попытка
			ТЗ = Запрос.Выполнить().Выгрузить();	
		Исключение
			
			Объект = СтрШаблон(	"{name: ""%1""}", ИмяОбъекта);
								
			ЛК_ЛогированиеСервер.ДобавитьЗаписьВЛог(	ЛК_ОбменДаннымиПовтИсп.УровниЛога().Ошибка,
												ЛК_ОбменДаннымиПовтИсп.СобытияЛога().РегистрацияЗаданияОчередиОбмена, 
												ЛК_ОбменДаннымиПовтИсп.УровниСобытийЛога().Ошибка,				
												ЛК_ЛогированиеСервер.ДанныеJSONОбъектСтрока(ЛК_ОбменДаннымиПовтИсп.УровниЛога().Ошибка,
																					ЛК_ЛогированиеСервер.ТекущаяДатаЛК(),
																					,
																					ТипОбъекта, 
																					ИмяОбъекта, 
																					"РегистрыСведений.ЗарегистрироватьЗаписьРегистраСведений.ВыгрузкаДанныхЗапроса",
																					ОписаниеОшибки()));			
			УстановитьПривилегированныйРежим(Ложь);
			Возврат;
			
		КонецПопытки;
				
		Для Каждого Запись Из НаборЗаписей Цикл
			
			Если МассивПользователейЛК.Найти(Запись.ФизическоеЛицо) = Неопределено  Тогда
				Продолжить;
			КонецЕсли;	
			
			НоваяСтрокаТЗ = ТЗ.Добавить();
			НоваяСтрокаТЗ.Сотрудник      = Запись.Сотрудник;
			НоваяСтрокаТЗ.ФизическоеЛицо = Запись.ФизическоеЛицо;
			
		КонецЦикла;
	
		Для Каждого СтрокаТЗ Из Тз  Цикл
			
			Если СтрокаТЗ.ВидСобытия = Перечисления.ВидыКадровыхСобытий.Прием
				ИЛИ СтрокаТЗ.ВидСобытия = Перечисления.ВидыКадровыхСобытий.Увольнение Тогда 
								
				РегистрыСведений.ЛК_ОчередьОбменаСЛКСсылочнымиДанными.ЗарегистрироватьИзменениеОбъекта(СтрокаТЗ.Сотрудник);
				
			КонецЕсли;
			
		КонецЦикла;		
		
		ТЗ.Свернуть("Сотрудник, ФизическоеЛицо");
		
		Для Каждого СтрокаТЗ Из Тз  Цикл	
			
			Структура = Новый Структура;
			Структура.Вставить("Сотрудник",      СтрокаТЗ.Сотрудник);
			Структура.Вставить("ФизическоеЛицо", СтрокаТЗ.ФизическоеЛицо);

			ДанныеJSON = ЛК_РаботаСJSONСервер.ЗаписьJSON(Структура);	
			
			ХешированиеДанных  = Новый ХешированиеДанных (ХешФункция.CRC32);
			ХешированиеДанных.Добавить(ДанныеJSON);
			ХешСумма = ХешированиеДанных.ХешСумма;
			
			РегистрыСведений.ЛК_ОчередьОбменаСЛКПроизвольнымиДанными.ЗарегистрироватьДобавлениеОбъекта(ТипОбъекта, ИмяОбъекта, ХешСумма, ДанныеJSON);
			
		КонецЦикла;
		
		Возврат;
		
	ИначеЕсли ИмяОбъекта = "ГрафикиРаботыПоВидамВремени" Тогда
		
		Если НаборЗаписей.Отбор.ГрафикРаботы.Использование И ЗначениеЗаполнено(НаборЗаписей.Отбор.ГрафикРаботы.Значение)
			И ТипЗнч(НаборЗаписей.Отбор.ГрафикРаботы.Значение) = Тип("СправочникСсылка.ГрафикиРаботыСотрудников") 
			И НаборЗаписей.Отбор.Месяц.Использование И ЗначениеЗаполнено(НаборЗаписей.Отбор.Месяц.Значение)  Тогда
			
			Если НаборЗаписей.Количество() = 0 Тогда
				Возврат;
			КонецЕсли;	
		
			Структура = Новый Структура;
			Структура.Вставить("ГрафикРаботы",     НаборЗаписей.Отбор.ГрафикРаботы.Значение);
			Структура.Вставить("Месяц",            НаборЗаписей.Отбор.Месяц.Значение);

			ДанныеJSON = ЛК_РаботаСJSONСервер.ЗаписьJSON(Структура);	
			
			ХешированиеДанных  = Новый ХешированиеДанных (ХешФункция.CRC32);
			ХешированиеДанных.Добавить(ДанныеJSON);
			ХешСумма = ХешированиеДанных.ХешСумма;
			
			РегистрыСведений.ЛК_ОчередьОбменаСЛКПроизвольнымиДанными.ЗарегистрироватьДобавлениеОбъекта(ТипОбъекта, ИмяОбъекта, ХешСумма, ДанныеJSON);
			
			Возврат;
			
		Иначе 
			Возврат;
		КонецЕсли;
		
	ИначеЕсли ИмяОбъекта = "ГрафикРаботыСотрудников" Тогда
		
		Запрос = Новый Запрос;
		Запрос.Текст = "ВЫБРАТЬ
						|	НАЧАЛОПЕРИОДА(ГрафикРаботыСотрудников.Период, День) КАК Период,
						|	ГрафикРаботыСотрудников.Сотрудник КАК Сотрудник
						|ИЗ
						|	РегистрСведений.ГрафикРаботыСотрудников КАК ГрафикРаботыСотрудников
						|ГДЕ
						|	ГрафикРаботыСотрудников.Регистратор = &Регистратор
						|";
		Запрос.УстановитьПараметр("Регистратор", НаборЗаписей.Отбор.Регистратор.Значение);
		
		Попытка
			ТЗ = Запрос.Выполнить().Выгрузить();	
		Исключение
			
			Объект = СтрШаблон(	"{name: ""%1""}", ИмяОбъекта);
								
			ЛК_ЛогированиеСервер.ДобавитьЗаписьВЛог(	ЛК_ОбменДаннымиПовтИсп.УровниЛога().Ошибка,
												ЛК_ОбменДаннымиПовтИсп.СобытияЛога().РегистрацияЗаданияОчередиОбмена, 
												ЛК_ОбменДаннымиПовтИсп.УровниСобытийЛога().Ошибка,				
												ЛК_ЛогированиеСервер.ДанныеJSONОбъектСтрока(ЛК_ОбменДаннымиПовтИсп.УровниЛога().Ошибка,
																					ЛК_ЛогированиеСервер.ТекущаяДатаЛК(),
																					,
																					ТипОбъекта, 
																					ИмяОбъекта, 
																					"РегистрыСведений.ЗарегистрироватьЗаписьРегистраСведений.ВыгрузкаДанныхЗапроса",
																					ОписаниеОшибки()));			
			УстановитьПривилегированныйРежим(Ложь);
			Возврат;
			
		КонецПопытки;
				
		Для Каждого Запись Из НаборЗаписей Цикл			
			
			НоваяСтрокаТЗ = ТЗ.Добавить();
			НоваяСтрокаТЗ.Сотрудник     = Запись.Сотрудник;
			НоваяСтрокаТЗ.Период 		= НачалоДня(Запись.Период);
			
		КонецЦикла;
		
		ТЗ.Свернуть("Сотрудник, Период");
		
		Для Каждого СтрокаТЗ Из Тз  Цикл	
			
			Структура = Новый Структура;
			Структура.Вставить("Сотрудник", СтрокаТЗ.Сотрудник);
			Структура.Вставить("Период", 	СтрокаТЗ.Период);

			ДанныеJSON = ЛК_РаботаСJSONСервер.ЗаписьJSON(Структура);	
			
			ХешированиеДанных  = Новый ХешированиеДанных (ХешФункция.CRC32);
			ХешированиеДанных.Добавить(ДанныеJSON);
			ХешСумма = ХешированиеДанных.ХешСумма;
			
			РегистрыСведений.ЛК_ОчередьОбменаСЛКПроизвольнымиДанными.ЗарегистрироватьДобавлениеОбъекта(ТипОбъекта, ИмяОбъекта, ХешСумма, ДанныеJSON);
			
		КонецЦикла;
		
		Возврат;

	ИначеЕсли ИмяОбъекта = "ВидыЗанятостиСотрудников" Тогда
		
		Запрос = Новый Запрос;
		Запрос.Текст = "ВЫБРАТЬ
						|	НАЧАЛОПЕРИОДА(ВидыЗанятостиСотрудников.Период, День) КАК Период,
						|	ВидыЗанятостиСотрудников.Сотрудник КАК Сотрудник
						|ИЗ
						|	РегистрСведений.ВидыЗанятостиСотрудников КАК ВидыЗанятостиСотрудников
						|ГДЕ
						|	ВидыЗанятостиСотрудников.Регистратор = &Регистратор
						|";
		Запрос.УстановитьПараметр("Регистратор", НаборЗаписей.Отбор.Регистратор.Значение);
		
		Попытка
			ТЗ = Запрос.Выполнить().Выгрузить();	
		Исключение
			
			Объект = СтрШаблон(	"{name: ""%1""}", ИмяОбъекта);
								
			ЛК_ЛогированиеСервер.ДобавитьЗаписьВЛог(	ЛК_ОбменДаннымиПовтИсп.УровниЛога().Ошибка,
												ЛК_ОбменДаннымиПовтИсп.СобытияЛога().РегистрацияЗаданияОчередиОбмена, 
												ЛК_ОбменДаннымиПовтИсп.УровниСобытийЛога().Ошибка,				
												ЛК_ЛогированиеСервер.ДанныеJSONОбъектСтрока(ЛК_ОбменДаннымиПовтИсп.УровниЛога().Ошибка,
																					ЛК_ЛогированиеСервер.ТекущаяДатаЛК(),
																					,
																					ТипОбъекта, 
																					ИмяОбъекта, 
																					"РегистрыСведений.ЗарегистрироватьЗаписьРегистраСведений.ВыгрузкаДанныхЗапроса",
																					ОписаниеОшибки()));			
			УстановитьПривилегированныйРежим(Ложь);
			Возврат;
			
		КонецПопытки;
				
		Для Каждого Запись Из НаборЗаписей Цикл			
			
			НоваяСтрокаТЗ = ТЗ.Добавить();
			НоваяСтрокаТЗ.Сотрудник     = Запись.Сотрудник;
			НоваяСтрокаТЗ.Период 		= НачалоДня(Запись.Период);
			
		КонецЦикла;
		
		ТЗ.Свернуть("Сотрудник, Период");
		
		Для Каждого СтрокаТЗ Из Тз  Цикл	
			
			Структура = Новый Структура;
			Структура.Вставить("Сотрудник", СтрокаТЗ.Сотрудник);
			Структура.Вставить("Период", 	СтрокаТЗ.Период);

			ДанныеJSON = ЛК_РаботаСJSONСервер.ЗаписьJSON(Структура);	
			
			ХешированиеДанных  = Новый ХешированиеДанных (ХешФункция.CRC32);
			ХешированиеДанных.Добавить(ДанныеJSON);
			ХешСумма = ХешированиеДанных.ХешСумма;
			
			РегистрыСведений.ЛК_ОчередьОбменаСЛКПроизвольнымиДанными.ЗарегистрироватьДобавлениеОбъекта(ТипОбъекта, ИмяОбъекта, ХешСумма, ДанныеJSON);
			
		КонецЦикла;
		
		Возврат;
		
	Иначе
		
		Объект1С = НаборЗаписей.ВыгрузитьКолонки();
		Для Каждого СтрокаНабора Из НаборЗаписей Цикл
			
			Если МассивПользователейЛК.Найти(СтрокаНабора.ФизическоеЛицо) = Неопределено  Тогда
				Продолжить;
			КонецЕсли;
			
			НоваяСтрока = Объект1С.Добавить();
			ЗаполнитьЗначенияСвойств(НоваяСтрока, СтрокаНабора);
			
		КонецЦикла;	
		
	КонецЕсли;
	
	Если Объект1С.Количество() = 0 Тогда
		Возврат;
	КонецЕсли;
	
	Объект1СJSON = ЛК_РаботаСJSONСервер.ЗаписьJSON(Объект1С);
	
	Структура = Новый Структура;
	Структура.Вставить("ТипОбъекта", ТипОбъекта);
	Структура.Вставить("ИмяОбъекта", ИмяОбъекта);
	Структура.Вставить("Объект",     Объект1СJSON);
				
	Попытка
		ДанныеJSON = ЛК_РаботаСJSONСервер.ЗаписатьJSON_АП(Структура);		
	Исключение
		
		Объект = СтрШаблон(	"{name: ""%1"", object: %2}", 
							ИмяОбъекта, 
							Объект1С);
							
		ЛК_ЛогированиеСервер.ДобавитьЗаписьВЛог(	ЛК_ОбменДаннымиПовтИсп.УровниЛога().Ошибка,
											ЛК_ОбменДаннымиПовтИсп.СобытияЛога().РегистрацияЗаданияОчередиОбмена, 
											ЛК_ОбменДаннымиПовтИсп.УровниСобытийЛога().Ошибка,
											ЛК_ЛогированиеСервер.ДанныеJSONОбъектJSON(ЛК_ОбменДаннымиПовтИсп.УровниЛога().Ошибка,
																				ЛК_ЛогированиеСервер.ТекущаяДатаЛК(),
																				,
																				ТипОбъекта,
																				ИмяОбъекта,
																				Объект, 
																				"РегистрыСведений.ЗарегистрироватьЗаписьРегистраСведений.ЗаписатьJSON_АП",
																				ОписаниеОшибки()));											
			
		УстановитьПривилегированныйРежим(Ложь);
		Возврат;
		
	КонецПопытки;
	
	ХешированиеДанных  = Новый ХешированиеДанных (ХешФункция.CRC32);
 	ХешированиеДанных.Добавить(ДанныеJSON);
 	ХешСумма = ХешированиеДанных.ХешСумма;   
	
	Если НаборЗаписей.Количество() = 0 Тогда
		РегистрыСведений.ЛК_ОчередьОбменаСЛКПроизвольнымиДанными.ЗарегистрироватьУдалениеОбъекта(ТипОбъекта, ИмяОбъекта, ХешСумма, ДанныеJSON);
	Иначе 	
		РегистрыСведений.ЛК_ОчередьОбменаСЛКПроизвольнымиДанными.ЗарегистрироватьДобавлениеОбъекта(ТипОбъекта, ИмяОбъекта, ХешСумма, ДанныеJSON);
	КонецЕсли;
	
	УстановитьПривилегированныйРежим(Ложь);
	
КонецПроцедуры	

Процедура ЗарегистрироватьЗаписьРегистраНакоплений(НаборЗаписей) Экспорт  
	
	УстановитьПривилегированныйРежим(Истина);
	
	Если Не ЗначениеЗаполнено(ЛК_РаботаСФункциямиКлиентСервер.Результат(ЛК_ОбменДаннымиПовтИсп.НастройкиСервиса()).АдресСервера) Тогда
		Возврат;
	КонецЕсли; 
	
	МассивПользователейЛК = ЛК_ОбменДаннымиПовтИсп.МассивПользователейЛК();
	
	ИмяМетаданных = НаборЗаписей.Метаданные().Имя;
	ТипОбъекта = ЛК_ОбменДаннымиПовтИсп.ТипыОбъектов().РННЗ;
	
	Если ИмяМетаданных = "НачисленияУдержанияПоСотрудникам"  Тогда
		Запрос = Новый Запрос;
		Запрос.Текст = "ВЫБРАТЬ РАЗРЕШЕННЫЕ РАЗЛИЧНЫЕ
						|	НачисленияУдержанияПоСотрудникам.Сотрудник КАК Сотрудник,
						|	НачисленияУдержанияПоСотрудникам.Период КАК Период,
						|	НачисленияУдержанияПоСотрудникам.ФизическоеЛицо КАК ФизическоеЛицо,
						|	НачисленияУдержанияПоСотрудникам.Организация КАК Организация
						|ИЗ
						|	РегистрНакопления.НачисленияУдержанияПоСотрудникам КАК НачисленияУдержанияПоСотрудникам
						|		ВНУТРЕННЕЕ СОЕДИНЕНИЕ РегистрСведений.ЛК_ПользователиЛК КАК ЛК_ПользователиЛК
						|		ПО (НачисленияУдержанияПоСотрудникам.ФизическоеЛицо = ЛК_ПользователиЛК.ФизическоеЛицо)
						|ГДЕ
						|	НачисленияУдержанияПоСотрудникам.Регистратор = &Регистратор";
		
		Запрос.УстановитьПараметр("Регистратор", НаборЗаписей.Отбор.Регистратор.Значение);
		
		Попытка
			ТЗ = Запрос.Выполнить().Выгрузить();	
		Исключение
			
			Объект = СтрШаблон(	"{name: ""%1""}", ИмяМетаданных);
								
			ЛК_ЛогированиеСервер.ДобавитьЗаписьВЛог(	ЛК_ОбменДаннымиПовтИсп.УровниЛога().Ошибка,
												ЛК_ОбменДаннымиПовтИсп.СобытияЛога().РегистрацияЗаданияОчередиОбмена, 
												ЛК_ОбменДаннымиПовтИсп.УровниСобытийЛога().Ошибка,				
												ЛК_ЛогированиеСервер.ДанныеJSONОбъектСтрока(ЛК_ОбменДаннымиПовтИсп.УровниЛога().Ошибка,
																					ЛК_ЛогированиеСервер.ТекущаяДатаЛК(),
																					,
																					ТипОбъекта, 
																					ИмяМетаданных, 
																					"РегистрыСведений.ЗарегистрироватьЗаписьРегистраНакоплений.ВыгрузкаДанныхЗапроса",
																					ОписаниеОшибки()));			
			УстановитьПривилегированныйРежим(Ложь);
			Возврат;
			
		КонецПопытки;
		
		ТЗНаборЗаписей = НаборЗаписей.Выгрузить(, "Сотрудник, Период, ФизическоеЛицо, Организация");
		ТЗНаборЗаписей.Свернуть("Сотрудник, ФизическоеЛицо, Организация, Период");
		
		Для Каждого Запись Из ТЗНаборЗаписей Цикл
			
			Если МассивПользователейЛК.Найти(Запись.ФизическоеЛицо) = Неопределено  Тогда
				Продолжить;
			КонецЕсли;	
			
			НоваяСтрокаТЗ = ТЗ.Добавить();
			НоваяСтрокаТЗ.Сотрудник      = Запись.Сотрудник;
			НоваяСтрокаТЗ.Период 		 = Запись.Период;
			НоваяСтрокаТЗ.ФизическоеЛицо = Запись.ФизическоеЛицо;
			НоваяСтрокаТЗ.Организация    = Запись.Организация;
			
		КонецЦикла;
		
		ТЗ.Свернуть("Сотрудник, ФизическоеЛицо, Организация, Период");
		
		Для Каждого СтрокаТЗ Из ТЗ  Цикл
			
			ТипОбъекта	= ЛК_ОбменДаннымиПовтИсп.ТипыОбъектов().Табель;
			
			Структура = Новый Структура;
			Структура.Вставить("Сотрудник",      				   СтрокаТЗ.Сотрудник);
			Структура.Вставить("Месяц",                            СтрокаТЗ.Период); 
			Структура.Вставить("ОрганизацияНаименование",          "");	

			ДанныеJSON = ЛК_РаботаСJSONСервер.ЗаписьJSON(Структура);	
			
			ХешированиеДанных  = Новый ХешированиеДанных (ХешФункция.CRC32);
			ХешированиеДанных.Добавить(ДанныеJSON);
			ХешСумма = ХешированиеДанных.ХешСумма;
			
			РегистрыСведений.ЛК_ОчередьОбменаСЛКПроизвольнымиДанными.ЗарегистрироватьДобавлениеОбъекта(ТипОбъекта, "Табель_" + ИмяМетаданных, ХешСумма, ДанныеJSON);

		КонецЦикла; 
		
		ТЗ.Свернуть("ФизическоеЛицо, Организация, Период");
		
		Для Каждого СтрокаТЗ Из ТЗ  Цикл
			
			ТипОбъекта	= ЛК_ОбменДаннымиПовтИсп.ТипыОбъектов().РасчетныйЛист;
			
			Структура = Новый Структура; 
			Структура.Вставить("ФизическоеЛицо", СтрокаТЗ.ФизическоеЛицо);
			Структура.Вставить("Организация",    СтрокаТЗ.Организация);
			Структура.Вставить("Месяц",          СтрокаТЗ.Период);

			ДанныеJSON = ЛК_РаботаСJSONСервер.ЗаписьJSON(Структура);	
			
			ХешированиеДанных  = Новый ХешированиеДанных (ХешФункция.CRC32);
			ХешированиеДанных.Добавить(ДанныеJSON);
			ХешСумма = ХешированиеДанных.ХешСумма;
			
			РегистрыСведений.ЛК_ОчередьОбменаСЛКПроизвольнымиДанными.ЗарегистрироватьДобавлениеОбъекта(ТипОбъекта, ИмяМетаданных, ХешСумма, ДанныеJSON);
			
		КонецЦикла;
		
	ИначеЕсли ИмяМетаданных = "ДанныеИндивидуальныхГрафиковСотрудников"  Тогда
		
		Запрос = Новый Запрос;
		Запрос.Текст = " ВЫБРАТЬ
						|	ДанныеИндивидуальныхГрафиковСотрудников.Сотрудник КАК Сотрудник,
						|	ДанныеИндивидуальныхГрафиковСотрудников.Период КАК Период
						|ИЗ
						|	РегистрНакопления.ДанныеИндивидуальныхГрафиковСотрудников КАК ДанныеИндивидуальныхГрафиковСотрудников
						|ГДЕ
						|	ДанныеИндивидуальныхГрафиковСотрудников.Регистратор = &Регистратор
						|";

		Запрос.УстановитьПараметр("Регистратор", НаборЗаписей.Отбор.Регистратор.Значение);
		
		Попытка
			ТЗ = Запрос.Выполнить().Выгрузить();	
		Исключение
			
			Объект = СтрШаблон(	"{name: ""%1""}", ИмяМетаданных);
								
			ЛК_ЛогированиеСервер.ДобавитьЗаписьВЛог(	ЛК_ОбменДаннымиПовтИсп.УровниЛога().Ошибка,
												ЛК_ОбменДаннымиПовтИсп.СобытияЛога().РегистрацияЗаданияОчередиОбмена, 
												ЛК_ОбменДаннымиПовтИсп.УровниСобытийЛога().Ошибка,				
												ЛК_ЛогированиеСервер.ДанныеJSONОбъектСтрока(ЛК_ОбменДаннымиПовтИсп.УровниЛога().Ошибка,
																					ЛК_ЛогированиеСервер.ТекущаяДатаЛК(),
																					,
																					ТипОбъекта, 
																					ИмяМетаданных, 
																					"РегистрыСведений.ЗарегистрироватьЗаписьРегистраНакоплений.ВыгрузкаДанныхЗапроса",
																					ОписаниеОшибки()));			
			УстановитьПривилегированныйРежим(Ложь);
			Возврат;
			
		КонецПопытки;
				
		Для Каждого Запись Из НаборЗаписей Цикл
			
			НоваяСтрокаТЗ = ТЗ.Добавить();
			НоваяСтрокаТЗ.Сотрудник = Запись.Сотрудник;
			НоваяСтрокаТЗ.Период	= Запись.Период;
			
		КонецЦикла;
		
		ТЗ.Свернуть("Сотрудник, Период");
		
		Для Каждого СтрокаТЗ Из Тз  Цикл

			ТипОбъекта	= ЛК_ОбменДаннымиПовтИсп.ТипыОбъектов().РННЗ;
			
			Структура = Новый Структура;
			Структура.Вставить("Сотрудник", СтрокаТЗ.Сотрудник);
			Структура.Вставить("Период",    СтрокаТЗ.Период);

			ДанныеJSON = ЛК_РаботаСJSONСервер.ЗаписьJSON(Структура);	
			
			ХешированиеДанных  = Новый ХешированиеДанных (ХешФункция.CRC32);
			ХешированиеДанных.Добавить(ДанныеJSON);
			ХешСумма = ХешированиеДанных.ХешСумма;
			
			РегистрыСведений.ЛК_ОчередьОбменаСЛКПроизвольнымиДанными.ЗарегистрироватьДобавлениеОбъекта(ТипОбъекта, ИмяМетаданных, ХешСумма, ДанныеJSON);
		КонецЦикла;
	
	КонецЕсли;
	
	УстановитьПривилегированныйРежим(Ложь);
	
КонецПроцедуры	

#КонецОбласти