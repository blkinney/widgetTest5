(function(Date, undefined) {
    function Moment(date, isUTC, lang) {
        this._d = date;
        this._isUTC = !!isUTC;
        this._a = date._a || null;
        date._a = null;
        this._lang = lang || false;
    }
    function Duration(duration) {
        var data = this._data = {}, years = duration.years || duration.y || 0, months = duration.months || duration.M || 0, weeks = duration.weeks || duration.w || 0, days = duration.days || duration.d || 0, hours = duration.hours || duration.h || 0, minutes = duration.minutes || duration.m || 0, seconds = duration.seconds || duration.s || 0, milliseconds = duration.milliseconds || duration.ms || 0;
        this._milliseconds = milliseconds + 1e3 * seconds + 6e4 * minutes + 36e5 * hours;
        this._days = days + 7 * weeks;
        this._months = months + 12 * years;
        data.milliseconds = milliseconds % 1e3;
        seconds += absRound(milliseconds / 1e3);
        data.seconds = seconds % 60;
        minutes += absRound(seconds / 60);
        data.minutes = minutes % 60;
        hours += absRound(minutes / 60);
        data.hours = hours % 24;
        days += absRound(hours / 24);
        days += 7 * weeks;
        data.days = days % 30;
        months += absRound(days / 30);
        data.months = months % 12;
        years += absRound(months / 12);
        data.years = years;
        this._lang = false;
    }
    function absRound(number) {
        return 0 > number ? Math.ceil(number) : Math.floor(number);
    }
    function leftZeroFill(number, targetLength) {
        var output = number + "";
        while (targetLength > output.length) output = "0" + output;
        return output;
    }
    function addOrSubtractDurationFromMoment(mom, duration, isAdding) {
        var currentDate, ms = duration._milliseconds, d = duration._days, M = duration._months;
        ms && mom._d.setTime(+mom + ms * isAdding);
        d && mom.date(mom.date() + d * isAdding);
        if (M) {
            currentDate = mom.date();
            mom.date(1).month(mom.month() + M * isAdding).date(Math.min(currentDate, mom.daysInMonth()));
        }
    }
    function isArray(input) {
        return "[object Array]" === Object.prototype.toString.call(input);
    }
    function compareArrays(array1, array2) {
        var i, len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length), diffs = 0;
        for (i = 0; len > i; i++) ~~array1[i] !== ~~array2[i] && diffs++;
        return diffs + lengthDiff;
    }
    function dateFromArray(input, asUTC) {
        var i, date;
        for (i = 1; 7 > i; i++) input[i] = null == input[i] ? 2 === i ? 1 : 0 : input[i];
        input[7] = asUTC;
        date = new Date(0);
        if (asUTC) {
            date.setUTCFullYear(input[0], input[1], input[2]);
            date.setUTCHours(input[3], input[4], input[5], input[6]);
        } else {
            date.setFullYear(input[0], input[1], input[2]);
            date.setHours(input[3], input[4], input[5], input[6]);
        }
        date._a = input;
        return date;
    }
    function loadLang(key, values) {
        var i, m, parse = [];
        !values && hasModule && (values = require("./lang/" + key));
        for (i = 0; langConfigProperties.length > i; i++) values[langConfigProperties[i]] = values[langConfigProperties[i]] || languages.en[langConfigProperties[i]];
        for (i = 0; 12 > i; i++) {
            m = moment([ 2e3, i ]);
            parse[i] = new RegExp("^" + (values.months[i] || values.months(m, "")) + "|^" + (values.monthsShort[i] || values.monthsShort(m, "")).replace(".", ""), "i");
        }
        values.monthsParse = values.monthsParse || parse;
        languages[key] = values;
        return values;
    }
    function getLangDefinition(m) {
        var langKey = "string" == typeof m && m || m && m._lang || null;
        return langKey ? languages[langKey] || loadLang(langKey) : moment;
    }
    function replaceFormatTokens(token) {
        return formatFunctionStrings[token] ? "'+(" + formatFunctionStrings[token] + ")+'" : token.replace(formattingRemoveEscapes, "").replace(/\\?'/g, "\\'");
    }
    function replaceLongDateFormatTokens(input) {
        return getLangDefinition().longDateFormat[input] || input;
    }
    function makeFormatFunction(format) {
        var output = "var a,b;return '" + format.replace(formattingTokens, replaceFormatTokens) + "';", Fn = Function;
        return new Fn("t", "v", "o", "p", "m", output);
    }
    function formatMoment(m, format) {
        function getValueFromArray(key, index) {
            return lang[key].call ? lang[key](m, format) : lang[key][index];
        }
        var lang = getLangDefinition(m);
        while (localFormattingTokens.test(format)) format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
        formatFunctions[format] || (formatFunctions[format] = makeFormatFunction(format));
        return formatFunctions[format](m, getValueFromArray, lang.ordinal, leftZeroFill, lang.meridiem);
    }
    function getParseRegexForToken(token) {
        switch (token) {
          case "DDDD":
            return parseTokenThreeDigits;

          case "YYYY":
            return parseTokenFourDigits;

          case "S":
          case "SS":
          case "SSS":
          case "DDD":
            return parseTokenOneToThreeDigits;

          case "MMM":
          case "MMMM":
          case "dd":
          case "ddd":
          case "dddd":
          case "a":
          case "A":
            return parseTokenWord;

          case "Z":
          case "ZZ":
            return parseTokenTimezone;

          case "T":
            return parseTokenT;

          case "MM":
          case "DD":
          case "YY":
          case "HH":
          case "hh":
          case "mm":
          case "ss":
          case "M":
          case "D":
          case "d":
          case "H":
          case "h":
          case "m":
          case "s":
            return parseTokenOneOrTwoDigits;

          default:
            return new RegExp(token.replace("\\", ""));
        }
    }
    function addTimeToArrayFromToken(token, input, datePartArray, config) {
        var a;
        switch (token) {
          case "M":
          case "MM":
            datePartArray[1] = null == input ? 0 : ~~input - 1;
            break;

          case "MMM":
          case "MMMM":
            for (a = 0; 12 > a; a++) if (getLangDefinition().monthsParse[a].test(input)) {
                datePartArray[1] = a;
                break;
            }
            break;

          case "D":
          case "DD":
          case "DDD":
          case "DDDD":
            null != input && (datePartArray[2] = ~~input);
            break;

          case "YY":
            input = ~~input;
            datePartArray[0] = input + (input > 70 ? 1900 : 2e3);
            break;

          case "YYYY":
            datePartArray[0] = ~~Math.abs(input);
            break;

          case "a":
          case "A":
            config.isPm = "pm" === (input + "").toLowerCase();
            break;

          case "H":
          case "HH":
          case "h":
          case "hh":
            datePartArray[3] = ~~input;
            break;

          case "m":
          case "mm":
            datePartArray[4] = ~~input;
            break;

          case "s":
          case "ss":
            datePartArray[5] = ~~input;
            break;

          case "S":
          case "SS":
          case "SSS":
            datePartArray[6] = ~~(1e3 * ("0." + input));
            break;

          case "Z":
          case "ZZ":
            config.isUTC = true;
            a = (input + "").match(parseTimezoneChunker);
            a && a[1] && (config.tzh = ~~a[1]);
            a && a[2] && (config.tzm = ~~a[2]);
            if (a && "+" === a[0]) {
                config.tzh = -config.tzh;
                config.tzm = -config.tzm;
            }
        }
    }
    function makeDateFromStringAndFormat(string, format) {
        var i, parsedInput, datePartArray = [ 0, 0, 1, 0, 0, 0, 0 ], config = {
            tzh: 0,
            tzm: 0
        }, tokens = format.match(formattingTokens);
        for (i = 0; tokens.length > i; i++) {
            parsedInput = (getParseRegexForToken(tokens[i]).exec(string) || [])[0];
            string = string.replace(getParseRegexForToken(tokens[i]), "");
            addTimeToArrayFromToken(tokens[i], parsedInput, datePartArray, config);
        }
        config.isPm && 12 > datePartArray[3] && (datePartArray[3] += 12);
        false === config.isPm && 12 === datePartArray[3] && (datePartArray[3] = 0);
        datePartArray[3] += config.tzh;
        datePartArray[4] += config.tzm;
        return dateFromArray(datePartArray, config.isUTC);
    }
    function makeDateFromStringAndArray(string, formats) {
        var output, formattedInputParts, i, currentDate, currentScore, inputParts = string.match(parseMultipleFormatChunker) || [], scoreToBeat = 99;
        for (i = 0; formats.length > i; i++) {
            currentDate = makeDateFromStringAndFormat(string, formats[i]);
            formattedInputParts = formatMoment(new Moment(currentDate), formats[i]).match(parseMultipleFormatChunker) || [];
            currentScore = compareArrays(inputParts, formattedInputParts);
            if (scoreToBeat > currentScore) {
                scoreToBeat = currentScore;
                output = currentDate;
            }
        }
        return output;
    }
    function makeDateFromString(string) {
        var i, format = "YYYY-MM-DDT";
        if (isoRegex.exec(string)) {
            for (i = 0; 4 > i; i++) if (isoTimes[i][1].exec(string)) {
                format += isoTimes[i][0];
                break;
            }
            return parseTokenTimezone.exec(string) ? makeDateFromStringAndFormat(string, format + " Z") : makeDateFromStringAndFormat(string, format);
        }
        return new Date(string);
    }
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
        var rt = lang.relativeTime[string];
        return "function" == typeof rt ? rt(number || 1, !!withoutSuffix, string, isFuture) : rt.replace(/%d/i, number || 1);
    }
    function relativeTime(milliseconds, withoutSuffix, lang) {
        var seconds = round(Math.abs(milliseconds) / 1e3), minutes = round(seconds / 60), hours = round(minutes / 60), days = round(hours / 24), years = round(days / 365), args = 45 > seconds && [ "s", seconds ] || 1 === minutes && [ "m" ] || 45 > minutes && [ "mm", minutes ] || 1 === hours && [ "h" ] || 22 > hours && [ "hh", hours ] || 1 === days && [ "d" ] || 25 >= days && [ "dd", days ] || 45 >= days && [ "M" ] || 345 > days && [ "MM", round(days / 30) ] || 1 === years && [ "y" ] || [ "yy", years ];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        args[4] = lang;
        return substituteTimeAgo.apply({}, args);
    }
    function makeGetterAndSetter(name, key) {
        moment.fn[name] = function(input) {
            var utc = this._isUTC ? "UTC" : "";
            if (null != input) {
                this._d["set" + utc + key](input);
                return this;
            }
            return this._d["get" + utc + key]();
        };
    }
    function makeDurationGetter(name) {
        moment.duration.fn[name] = function() {
            return this._data[name];
        };
    }
    function makeDurationAsGetter(name, factor) {
        moment.duration.fn["as" + name] = function() {
            return +this / factor;
        };
    }
    var moment, i, VERSION = "1.7.0", round = Math.round, languages = {}, currentLanguage = "en", hasModule = "undefined" != typeof module && module.exports, langConfigProperties = "months|monthsShort|weekdays|weekdaysShort|weekdaysMin|longDateFormat|calendar|relativeTime|ordinal|meridiem".split("|"), aspNetJsonRegex = /^\/?Date\((\-?\d+)/i, formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|zz?|ZZ?)/g, localFormattingTokens = /(LT|LL?L?L?)/g, formattingRemoveEscapes = /(^\[)|(\\)|\]$/g, parseMultipleFormatChunker = /([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi, parseTokenOneOrTwoDigits = /\d\d?/, parseTokenOneToThreeDigits = /\d{1,3}/, parseTokenThreeDigits = /\d{3}/, parseTokenFourDigits = /\d{1,4}/, parseTokenWord = /[0-9a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/i, parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i, parseTokenT = /T/i, isoRegex = /^\s*\d{4}-\d\d-\d\d(T(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/, isoFormat = "YYYY-MM-DDTHH:mm:ssZ", isoTimes = [ [ "HH:mm:ss.S", /T\d\d:\d\d:\d\d\.\d{1,3}/ ], [ "HH:mm:ss", /T\d\d:\d\d:\d\d/ ], [ "HH:mm", /T\d\d:\d\d/ ], [ "HH", /T\d\d/ ] ], parseTimezoneChunker = /([\+\-]|\d\d)/gi, proxyGettersAndSetters = "Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|"), unitMillisecondFactors = {
        Milliseconds: 1,
        Seconds: 1e3,
        Minutes: 6e4,
        Hours: 36e5,
        Days: 864e5,
        Months: 2592e6,
        Years: 31536e6
    }, formatFunctions = {}, formatFunctionStrings = {
        M: "(a=t.month()+1)",
        MMM: 'v("monthsShort",t.month())',
        MMMM: 'v("months",t.month())',
        D: "(a=t.date())",
        DDD: "(a=new Date(t.year(),t.month(),t.date()),b=new Date(t.year(),0,1),a=~~(((a-b)/864e5)+1.5))",
        d: "(a=t.day())",
        dd: 'v("weekdaysMin",t.day())',
        ddd: 'v("weekdaysShort",t.day())',
        dddd: 'v("weekdays",t.day())',
        w: "(a=new Date(t.year(),t.month(),t.date()-t.day()+5),b=new Date(a.getFullYear(),0,4),a=~~((a-b)/864e5/7+1.5))",
        YY: "p(t.year()%100,2)",
        YYYY: "p(t.year(),4)",
        a: "m(t.hours(),t.minutes(),!0)",
        A: "m(t.hours(),t.minutes(),!1)",
        H: "t.hours()",
        h: "t.hours()%12||12",
        m: "t.minutes()",
        s: "t.seconds()",
        S: "~~(t.milliseconds()/100)",
        SS: "p(~~(t.milliseconds()/10),2)",
        SSS: "p(t.milliseconds(),3)",
        Z: '((a=-t.zone())<0?((a=-a),"-"):"+")+p(~~(a/60),2)+":"+p(~~a%60,2)',
        ZZ: '((a=-t.zone())<0?((a=-a),"-"):"+")+p(~~(10*a/6),4)'
    }, ordinalizeTokens = "DDD w M D d".split(" "), paddedTokens = "M D H h m s w".split(" ");
    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatFunctionStrings[i + "o"] = formatFunctionStrings[i] + "+o(a)";
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatFunctionStrings[i + i] = "p(" + formatFunctionStrings[i] + ",2)";
    }
    formatFunctionStrings.DDDD = "p(" + formatFunctionStrings.DDD + ",3)";
    moment = function(input, format) {
        if (null === input || "" === input) return null;
        var date, matched;
        if (moment.isMoment(input)) return new Moment(new Date(+input._d), input._isUTC, input._lang);
        if (format) date = isArray(format) ? makeDateFromStringAndArray(input, format) : makeDateFromStringAndFormat(input, format); else {
            matched = aspNetJsonRegex.exec(input);
            date = input === undefined ? new Date() : matched ? new Date(+matched[1]) : input instanceof Date ? input : isArray(input) ? dateFromArray(input) : "string" == typeof input ? makeDateFromString(input) : new Date(input);
        }
        return new Moment(date);
    };
    moment.utc = function(input, format) {
        if (isArray(input)) return new Moment(dateFromArray(input, true), true);
        if ("string" == typeof input && !parseTokenTimezone.exec(input)) {
            input += " +0000";
            format && (format += " Z");
        }
        return moment(input, format).utc();
    };
    moment.unix = function(input) {
        return moment(1e3 * input);
    };
    moment.duration = function(input, key) {
        var ret, isDuration = moment.isDuration(input), isNumber = "number" == typeof input, duration = isDuration ? input._data : isNumber ? {} : input;
        isNumber && (key ? duration[key] = input : duration.milliseconds = input);
        ret = new Duration(duration);
        isDuration && (ret._lang = input._lang);
        return ret;
    };
    moment.humanizeDuration = function(num, type, withSuffix) {
        return moment.duration(num, true === type ? null : type).humanize(true === type ? true : withSuffix);
    };
    moment.version = VERSION;
    moment.defaultFormat = isoFormat;
    moment.lang = function(key, values) {
        var i;
        if (!key) return currentLanguage;
        (values || !languages[key]) && loadLang(key, values);
        if (languages[key]) {
            for (i = 0; langConfigProperties.length > i; i++) moment[langConfigProperties[i]] = languages[key][langConfigProperties[i]];
            moment.monthsParse = languages[key].monthsParse;
            currentLanguage = key;
        }
    };
    moment.langData = getLangDefinition;
    moment.isMoment = function(obj) {
        return obj instanceof Moment;
    };
    moment.isDuration = function(obj) {
        return obj instanceof Duration;
    };
    moment.lang("en", {
        months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        longDateFormat: {
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D YYYY",
            LLL: "MMMM D YYYY LT",
            LLLL: "dddd, MMMM D YYYY LT"
        },
        meridiem: function(hours, minutes, isLower) {
            return hours > 11 ? isLower ? "pm" : "PM" : isLower ? "am" : "AM";
        },
        calendar: {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[last] dddd [at] LT",
            sameElse: "L"
        },
        relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        ordinal: function(number) {
            var b = number % 10;
            return 1 === ~~(number % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
        }
    });
    moment.fn = Moment.prototype = {
        clone: function() {
            return moment(this);
        },
        valueOf: function() {
            return +this._d;
        },
        unix: function() {
            return Math.floor(+this._d / 1e3);
        },
        toString: function() {
            return this._d.toString();
        },
        toDate: function() {
            return this._d;
        },
        toArray: function() {
            var m = this;
            return [ m.year(), m.month(), m.date(), m.hours(), m.minutes(), m.seconds(), m.milliseconds(), !!this._isUTC ];
        },
        isValid: function() {
            if (this._a) return !compareArrays(this._a, (this._a[7] ? moment.utc(this) : this).toArray());
            return !isNaN(this._d.getTime());
        },
        utc: function() {
            this._isUTC = true;
            return this;
        },
        local: function() {
            this._isUTC = false;
            return this;
        },
        format: function(inputString) {
            return formatMoment(this, inputString ? inputString : moment.defaultFormat);
        },
        add: function(input, val) {
            var dur = val ? moment.duration(+val, input) : moment.duration(input);
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this;
        },
        subtract: function(input, val) {
            var dur = val ? moment.duration(+val, input) : moment.duration(input);
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this;
        },
        diff: function(input, val, asFloat) {
            var output, inputMoment = this._isUTC ? moment(input).utc() : moment(input).local(), zoneDiff = 6e4 * (this.zone() - inputMoment.zone()), diff = this._d - inputMoment._d - zoneDiff, year = this.year() - inputMoment.year(), month = this.month() - inputMoment.month(), date = this.date() - inputMoment.date();
            output = "months" === val ? 12 * year + month + date / 30 : "years" === val ? year + (month + date / 30) / 12 : "seconds" === val ? diff / 1e3 : "minutes" === val ? diff / 6e4 : "hours" === val ? diff / 36e5 : "days" === val ? diff / 864e5 : "weeks" === val ? diff / 6048e5 : diff;
            return asFloat ? output : round(output);
        },
        from: function(time, withoutSuffix) {
            return moment.duration(this.diff(time)).lang(this._lang).humanize(!withoutSuffix);
        },
        fromNow: function(withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },
        calendar: function() {
            var diff = this.diff(moment().sod(), "days", true), calendar = this.lang().calendar, allElse = calendar.sameElse, format = -6 > diff ? allElse : -1 > diff ? calendar.lastWeek : 0 > diff ? calendar.lastDay : 1 > diff ? calendar.sameDay : 2 > diff ? calendar.nextDay : 7 > diff ? calendar.nextWeek : allElse;
            return this.format("function" == typeof format ? format.apply(this) : format);
        },
        isLeapYear: function() {
            var year = this.year();
            return 0 === year % 4 && 0 !== year % 100 || 0 === year % 400;
        },
        isDST: function() {
            return this.zone() < moment([ this.year() ]).zone() || this.zone() < moment([ this.year(), 5 ]).zone();
        },
        day: function(input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            return null == input ? day : this.add({
                d: input - day
            });
        },
        startOf: function(val) {
            switch (val.replace(/s$/, "")) {
              case "year":
                this.month(0);

              case "month":
                this.date(1);

              case "day":
                this.hours(0);

              case "hour":
                this.minutes(0);

              case "minute":
                this.seconds(0);

              case "second":
                this.milliseconds(0);
            }
            return this;
        },
        endOf: function(val) {
            return this.startOf(val).add(val.replace(/s?$/, "s"), 1).subtract("ms", 1);
        },
        sod: function() {
            return this.clone().startOf("day");
        },
        eod: function() {
            return this.clone().endOf("day");
        },
        zone: function() {
            return this._isUTC ? 0 : this._d.getTimezoneOffset();
        },
        daysInMonth: function() {
            return moment.utc([ this.year(), this.month() + 1, 0 ]).date();
        },
        lang: function(lang) {
            if (lang === undefined) return getLangDefinition(this);
            this._lang = lang;
            return this;
        }
    };
    for (i = 0; proxyGettersAndSetters.length > i; i++) makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase(), proxyGettersAndSetters[i]);
    makeGetterAndSetter("year", "FullYear");
    moment.duration.fn = Duration.prototype = {
        weeks: function() {
            return absRound(this.days() / 7);
        },
        valueOf: function() {
            return this._milliseconds + 864e5 * this._days + 2592e6 * this._months;
        },
        humanize: function(withSuffix) {
            var difference = +this, rel = this.lang().relativeTime, output = relativeTime(difference, !withSuffix, this.lang());
            withSuffix && (output = (0 >= difference ? rel.past : rel.future).replace(/%s/i, output));
            return output;
        },
        lang: moment.fn.lang
    };
    for (i in unitMillisecondFactors) if (unitMillisecondFactors.hasOwnProperty(i)) {
        makeDurationAsGetter(i, unitMillisecondFactors[i]);
        makeDurationGetter(i.toLowerCase());
    }
    makeDurationAsGetter("Weeks", 6048e5);
    hasModule && (module.exports = moment);
    "undefined" == typeof ender && (this["moment"] = moment);
    "function" == typeof define && define.amd && define("moment", [], function() {
        return moment;
    });
}).call(this, Date);