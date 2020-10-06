const SYSTEM_DEFAULT_ERROR = {
    tr: 'Sistemde geçici bir hata oluşmuştur. Lütfen daha sonra tekrar deneyiniz.',
    en: 'There has been a temporary error. Please try again later.',
};

const returnMessages = {
    ERR_UNDEFINED: {
        code: -1,
        messages: {
            tr: 'Bir hata oluştu. Lütfen daha sonra tekrar dene.',
            en: 'Error occurred. Please try again later.',
        },
    },
    ERR_INTERNAL: {
        code: 1,
        messages: {
            tr: 'Sistem hatası.',
            en: 'Internal error.',
        },
    },
    ERR_VALIDATION: {
        code: 2,
        messages: {
            tr: 'Gönderilen istekteki bilgiler yanlış.',
            en: 'Error while validating request inputs.',
        },
    },
    ERR_AUTHORIZATION: {
        code: 3,
        messages: {
            tr: 'Bilgileri görmeye yetkili değilsiniz.',
            en: 'Not authorized.',
        },
    },
    ERR_NOTFOUND: {
        code: 4,
        messages: {
            tr: 'Bilgi bulunamadı.',
            en: 'Not found.',
        },
    },
    NOT_CREATED_SUBSCRIBER: {
        code: 5,
        messages: SYSTEM_DEFAULT_ERROR,
    },
    NOT_CREATED_PACKAGES: {
        code: 6,
        messages: SYSTEM_DEFAULT_ERROR,
    },
    FAILED_GET_CURRENT_PACKAGES: {
        code: 7,
        messages: SYSTEM_DEFAULT_ERROR,
    },
    FAILED_GET_LATEST_PACKAGES_PHP: {
        code: 8,
        messages: SYSTEM_DEFAULT_ERROR,
    },
    FAILED_GET_LATEST_PACKAGES_JAVASCRIPT: {
        code: 9,
        messages: SYSTEM_DEFAULT_ERROR,
    },
    FAILED_GET_LATEST_REPOSITORY_LANGUAGES: {
        code: 10,
        messages: SYSTEM_DEFAULT_ERROR,
    },
    NOT_UPDATED_SUBSCRIBER: {
        code: 11,
        messages: SYSTEM_DEFAULT_ERROR,
    },
    NOT_SUCCESSFUL_SUBSCRIBER_SCHEDULER: {
        code: 12,
        messages: SYSTEM_DEFAULT_ERROR,
    },
};

const validationMessages = {
    DUPLICATE_REPO_WITH_SUBSCRIBER: {
        tr: 'Ayni repository ayni kullanici icin daha once olusturulmustur.',
        en: 'There is already exists same repo with entered subscriber.',
    },
    INVALID_FORMAT: {
        tr: 'Girilen parametrenin formatı yanlıştır.',
        en: 'Invalid format type for entered parameter.',
    },
    INVALID_ID: {
        tr: 'Id Hatalı.',
        en: 'Invalid Id.',
    },
    MISSING_FIELDS: {
        tr: 'Eksik parametreler bulunmaktadir.',
        en: 'There is missing fields.',
    },
};

module.exports = {
    RETURN_MESSAGES: returnMessages,
    VALIDATION_MESSAGES: validationMessages,
};
