﻿#Область ПрограммныйИнтерфейс

Функция СтруктураВозврата() Экспорт
	
	Структура = Новый Структура;
	Структура.Вставить("ЕстьОшибки", Ложь);
	Структура.Вставить("Ошибки", Новый Массив);
	Структура.Вставить("Результат", Неопределено);
	
	Возврат Структура;
	
КонецФункции

Процедура ДобавитьОшибку(СтруктураВозврата, Ошибка) Экспорт 
	
	СтруктураВозврата.ЕстьОшибки = Истина;
	СтруктураВозврата.Ошибки.Добавить(Ошибка);
	
КонецПроцедуры	

Процедура ДобавитьРезультат(СтруктураВозврата, Результат) Экспорт 
	
	СтруктураВозврата.Результат = Результат;
	
КонецПроцедуры

Функция Ошибка(СтруктураВозврата) Экспорт
	
	Возврат СтруктураВозврата.ЕстьОшибки;
	
КонецФункции

Функция ОшибкиСтрокой(СтруктураВозврата) Экспорт
	
	ОписаниеОшибок = "";
	
	Для Каждого Ошибка Из СтруктураВозврата.Ошибки Цикл 
		ОписаниеОшибки = ОписаниеОшибок + """" + Ошибка + """,""";
	КонецЦикла;
	
	ОписаниеОшибок = Лев(ОписаниеОшибок, СтрДлина(ОписаниеОшибок) - 2);
	
	Возврат ОписаниеОшибок;
	
КонецФункции

Процедура СообщитьОбОшибках(СтруктураВозврата) Экспорт
	
	Для Каждого Ошибка Из СтруктураВозврата.Ошибки Цикл
		
		Сообщение = Новый  СообщениеПользователю;
		Сообщение.Текст = Ошибка;
		Сообщение.Сообщить();
		
	КонецЦикла;
	
КонецПроцедуры

Процедура ОбъединитьОшибки(СтруктураВозврата, ОбъединяемаяСтруктура) Экспорт
	
	СтруктураВозврата.ЕстьОшибки = СтруктураВозврата.ЕстьОшибки Или ОбъединяемаяСтруктура.ЕстьОшибки;	
	
	Для Каждого Ошибка Из ОбъединяемаяСтруктура.Ошибки Цикл
		СтруктураВозврата.Ошибки.Добавить(Ошибка);	
	КонецЦикла;
	
КонецПроцедуры

Функция Результат(СтруктураВозврата) Экспорт
	
	Возврат СтруктураВозврата.Результат;
	
КонецФункции

#КонецОбласти

#Область СлужебныйПрограммныйИнтерфейс

#КонецОбласти

#Область СлужебныеПроцедурыИФункции

#КонецОбласти