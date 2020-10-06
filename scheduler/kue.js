const kue = require('kue-scheduler');
const moment = require('moment-timezone');
const worker = require('./worker');
const logger = require('../config/winston');

const CONSTANTS = require('../utils/constants');

const Queue = kue.createQueue();

module.exports.getLatestAndUpdatePackages = () => {
    const jobName = CONSTANTS.JOB_SCHEDULER_NAME_FOR_ALL_UPDATE_PACKAGES;
    const job = Queue
        .createJob(jobName, { timezone: CONSTANTS.MOMENT_ISTANBUL_TIMEZONE })
        .attempts(3);

    Queue.every(CONSTANTS.CRON_EXPR_FOR_ALL_UPDATE_PACKAGES, job);

    worker.getLatestAndUpdatePackages({ jobName });
};
/**
 * TODO
 *  -------------Olusturulmadan once -------------
 *  Step 0: Ilk kayit olurken eger sistemin saatine bakilacak, Or: 15:50 ve Repo: 'R1'
 *  Step 1: Sistem de aktif processlere bakilacak, eger 15:50 yoksa direkt createJob.
 *  Step 2: Aktif processlerden 15:50 varsa, her halukarda olusturulmayacak. Yani JobName: HH:mm
 *  -------------Olusturulduktan sonra -------------
 *  Step 3: Scheduler ertesi gun 15:50 de calisti, git Subscriber tabloasuna, createdAt ile 15:50 de olan tum REPOlari getir de.
 *  Step 4: R1,Ali,15:40 | R1,Veli,15:40 | R2,Ahmet,15:40 | R3,Ayse,15:50 boyle bir tablo var elimizde, bize gelen repolar 15:40 olan R1 ve R2
 *  !Step 5: Optional Ama gelen R1 ve R2 reposunu 1 gun onceden kontrol ettik zaten,
 *           Eger Repo Modified Time'i 1 gun gecmemisse yeni package gelmis mi diye githuba gidip parse etme bosuna.
 *  Step 6: distinct ile Repolari aldik, ve github'a gittik repolarin dependencylerinin guncel halini aldik, yenisi gelmis olabilir
 *  Step 7: R1: [axios,lodash] R2: [axios,jest] bunlari da distinct le [axios, lodash, jest]
 *  Step 8: AllPackages Colection a find at, bu package'lar var mi bak (en guncel orasi hemen disari gitme)
 *  Step 9: Packages tan gelen ArrDB[axios,lodash] bunlar guncel olarak elimizde var. [jest] elimizde yok.
 *  Step 10: Elimizde olmayanlar icin getLatestPackages()'i calistir en gunceli disaridan al.
 *  !Step 11: Jesti aldiktan sonra AllPackages'e insert etmeyi unutma!
 *  Step 12: Su an elinde en guncel olarak [axios,lodash,jest] var, bunlari Repolara geri dagit.
 *  Step 13: R1 ve R2 de elinde objelerin currenti vardi, simdi latest tag'i ile yeni versionlar ile objeleri ata.
 *  Step 14: Elinde guncel ve latest olduguna gore semver karsilastirmasi yap.
 *  Step 15: Cikan sonuclara dikkat et, bir repo icin axios 3.0.1 iken digerinde 5.0.1 yani guncel olabilir, her axiosu olani guncelleme!
 *  Step 16: Akabinde R1 ve R2 de olan Ali, Veli, Ahmet e mail at.
 * */
module.exports.subscriberSchedulerJob = () => {
    const jobName = moment().tz(CONSTANTS.MOMENT_ISTANBUL_TIMEZONE).format('HH:mm');
    const jobInfo = {
        jobName,
    };
    const job = Queue
        .createJob(jobInfo.jobName, { timezone: CONSTANTS.MOMENT_ISTANBUL_TIMEZONE })
        .backoff({
            delay: 3000,
        })
        .attempts(3)
        .unique(jobInfo.jobName);

    const [hour, min] = jobName.split(':');
    Queue.every(`${min} ${hour} * * *`, job);

    worker.subscriberSchedulerJobWorker({ jobName: jobInfo.jobName });
};
