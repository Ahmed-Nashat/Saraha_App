const errorsMessages = {
  email: {
    ar: "البريد الالكتروني غير صحيح",
    en: "invalid email format, please enter email like this example@gmail.com",
  },
  longPassword: {
    ar: "الباسورد اطول من المتوقع",
    en: "password longer than expected",
  },
  shortPassword: {
    ar: "الباسورد اقصر من المتوقع",
    en: "password shorter than expected",
  },
  name: {
    longName: {
      ar: "الاسم اطول ن من المتوقع",
      en: "name must be less than 30 charachters",
    },
    shortName: {
      ar: "الاسم اقصر من المتوقع  ",
      en: "name must be more than 5 charachters",
    },
    invalidName: {
      ar: "الاسم غير صحيح",
      en: "name must be a string",
    },
    twoNames: {
      ar: "الاسم الكامل غير صحيح",
      en: "full name must have 2 names, like that ahmed nashaat",
    },
  },
  gender: {
    ar: "ذكر او انثى فقط",
    en: "gender must be male or female",
  },
  stringBool: {
    ar: "القيمة يجب ان تكون true او false",
    en: "this value must be true or false",
  },
  language: {
    ar: "اللغة يجب ان تكون ar او en",
    en: "language must be ar or en",
  },
  wrongPhoneNumber: {
    ar: "رقم الهاتف غير صحيح, يجب ان يكون رقم الهاتف مصري",
    en: "invalid phone number, please enter egyptian phone number like this 01xxxxxxxxx",
  },
  invalidObjectId: {
    ar: "معرف مونجو غير صحيح",
    en: "This isn't valid ObjectId",
  },
};

export const getErrorMessage = (lang, errorCode) => {
  const language = lang === "ar" ? "ar" : "en";
  const keys = errorCode?.split(".");
  let messageObj = errorsMessages;

  for (const key of keys) {
    messageObj = messageObj?.[key];
  }

  return messageObj?.[language] || messageObj?.en || "";
};
