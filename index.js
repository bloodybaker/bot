const { VK } = require('vk-io');
const axios = require('axios');
const needle = require("needle");
const parser = require('xml2json');
const moment = require('moment');
const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');
const fs = require('fs')
key = 'yandex translate token here'
var translate = require('yandex-translate')(key)
let v = 5.101
let t1ken = '48b6292c8add1298a11db7087512d5cc7285fbe7d8cebe280aa2af03446cc3d67ace80395213b90894bac';
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'server222.hosting.reg.ru', // link to mysql database
    user     : 'u0613437_vkbot', // username
    password : 'Lock2612', 
    database : 'u0613437_vkbot' 
});
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

const vk = new VK({
    token: '48b6292c8add1298a11db7087512d5cc7285fbe7d8cebe280aa2af03446cc3d67ace80395213b90894bac'
});
vk.updates.hear('!updateadmins', data => {
    let user = data.senderId;
    let peer = data.peerId;
    vk.api.messages.getConversationMembers({peer_id: peer, access_token: t1ken, v: v}).then(res => {
        for (var i = 0; i < res.items.length; i++) {
            connection.query("INSERT INTO `members` (`id`) VALUES (?);", [res.items[i].member_id], function (error, result, fields) {

            })
        }
    })
})
vk.updates.on('message', async (data, next) => {
    let chk = 'chat_invite_user';
    let chk2 = 'chat_invite_user_by_link';
    let chk3 = 'chat_kick_user';
    let peer = data.peerId;
    if (data.eventType != undefined){
        let cid = data.peerId - 2e9
        let user = data.senderId;
        let fuser = data.eventMemberId
        if (fuser == -144372147 && data.eventType == chk){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `status` = 3", [peer], async function (err, ress11, f) {
                if (ress11.length != 0) {
                    for (var i = 0; i < ress11.length; i++) {
                        connection.query("DELETE FROM `admins` WHERE `admins`.`id` = ?;", [ress11[i].id], async function (err, ress22, f) { })
                    }
                    data.reply('Данный бот уже находился в данной беседе, список пользователей с правами администратора был обнулен! Выдайте права администратора боту и пропишите команду !apply снова!')
                } else  data.reply('Привет, я Бот Лирика и меня создал Luca_Vita. \n\n Прежде чем Вы сможете начать использовать меня, выдайте мне права администратора беседы и затем пропишите команду !apply . После этого весь мой функционал станет доступен Вам.')
            })
        }
		        if (data.eventType == chk3) {
            if (fuser == user) {
                connection.query("SELECT * FROM `tets` WHERE `id` = ?", [user], async function (err, chkcmd, f) {
                    if (chkcmd.length == 1) {
                        connection.query("DELETE FROM `tets` WHERE `tets`.`id` = ?", [user], async function (err, chkcmd, f) {

                    })
                    }
                })
            }

            if (fuser != user){
                connection.query("SELECT * FROM `tets` WHERE `id` = ?", [fuser], async function (err, chkcmd, f) {
                    if (chkcmd.length == 1) {
                        connection.query("DELETE FROM `tets` WHERE `tets`.`id` = ?", [fuser], async function (err, chkcmd, f) {

                        })
                    }
                })
            }
        }
        if (data.eventType == chk3 && fuser == user){
            let commandor = 'exitkick'
            connection.query("SELECT * FROM `commands` WHERE `peer` = ? AND `command` = ? AND `status` = 1", [peer, commandor], async function (err, chkcmd, f) {
                if(chkcmd.length == 1){
                    vk.api.messages.removeChatUser({ chat_id: cid, member_id: user, access_token: t1ken, v: v });
                }
            })
        }
		
        if ((data.eventType == chk) || (data.eventType == chk2)){
            if (data.eventType == chk) {   let eventuser = data.eventMemberId;
                connection.query("SELECT * FROM `members` WHERE `id` = ?", [eventuser], async function (err, earadd, f) {
                    if (earadd == 0) {
                        connection.query("INSERT INTO `members` (`id`) VALUES (?);", [eventuser], function (error, result, fields) {

                        })
                    }
                })
                let banned = data.eventMemberId;
                connection.query("SELECT * FROM `bans` WHERE `peer` = ? AND `userid` = ?", [peer, banned], async function (err, alreadybanned, f) {
                    if(alreadybanned.length == 1){
                        vk.api.messages.removeChatUser({ chat_id: cid, member_id: banned, access_token: t1ken, v: v });
                        data.reply('Пользователь заблокирован! Чтобы его добавить, Вам необходимо разбанить его командой !unban')
                    }
                })
                connection.query("SELECT * FROM `warns` WHERE `peer` = ? AND `userid` = ?", [peer, banned], async function (err, warnedlater, f) {
                    if(warnedlater.length == 1){
                        connection.query("UPDATE `warns` SET `number` = ? WHERE `warns`.`id` = ?;", [0, warnedlater[0].id], function (error, result, fields) {})
                    }
                })
            }
            if (data.eventType == chk2) {
                let banned = data.senderId;
                connection.query("SELECT * FROM `bans` WHERE `peer` = ? AND `userid` = ?", [peer, banned], async function (err, alreadybanned, f) {
                    if(alreadybanned.length == 1) {
                        vk.api.messages.removeChatUser({ chat_id: cid, member_id: banned, access_token: t1ken, v: v });
                        data.reply('Пользователь заблокирован! Чтобы его добавить, Вам необходимо разбанить его командой !unban')
                    }
                })
                connection.query("SELECT * FROM `warns` WHERE `peer` = ? AND `userid` = ?", [peer, banned], async function (err, warnedlater, f) {
                    if(warnedlater.length == 1){
                        connection.query("UPDATE `warns` SET `number` = ? WHERE `warns`.`id` = ?;", [0, warnedlater[0].id], function (error, result, fields) {})
                    }
                })
            }
        }
    }
    const words = transformWords(
        ['еблоид','бляхомудия','мамкоёб','припизженный','выбляпиздрище','дурак','дура','Объебал','Объебать','Наебашиться','Доебаться','Блядский','Ебанутый','Спидозный','Схуяли','Пиздеж','Проёб','Уебан','Ебучка','Полуебок','Проститутка','Ёбаный','Ебалай','тупая','тупой','уебан','ебашим','матка','пиздогрыз','ебанашка','motherfucker','pussy','кончефлыга','dick','член','ебланище','ссанина','рукаблуд','bastard','маразота','Далбоёб','тварь','даун','пиздабол','Спермоглот','Кончалыга','хуйню','Хуеглот','ебланище','Гандонище','Конч','Конченый','Конченный','Пидр','Хуила','Ебантяй','Пидарасина','Ебаклак','хуятина','уебанище','урод','гавнаед','хуило','уебывай','геюга','гей','додик','пидараска','ебошит','Ебашу','Хуярю','пздц','шмара','хуесосина','Говнарь','переебу','уебу','выебу','Хуепутоло','суко','еблантяй','долбаебина','ЕБАНУЛ','УЕБАЛСЯ','Объебался','укроп','пиздых','охуитительный','нахуа','Блядогон','впиздячил','рофланебало','хуямбула','херасе','залупина','пендос','Шлюхан','Ёбана','Хули','Охуеный','Охуенный','Аутист','Припиздок','Пиздос','Наебал','Отсоси','хуеголовый','Хуелиз','Влагалище','Пидорас','Срань','Гандоновец',' говноедище','Пидораска','Пидрила','ебашь','Охуело','сракотан','Пенис','ахуель','Сиська','Сиськи','Дебич','Еблостер','Пидорский','Уебанский','Ебобо','Ебонатор','епта','долбоебина','пидорасина','обани рот','рукоблуд','mq','сосать','гамосек','гомосек','гомосексуал','Ебасосина','биба','хуяндок','голубой','Голубь','петух','хуеглотище','херобуромалиновый','хуеёб','ебанарот','сучёнок','сучечка','ДЦПшник','ДЦП','говноёб','Аутяга','спизжено','пиздолюб','пиздоглот','жопаглот','Пиздёнка','пидорасище','Пиздоболить','Еблакшери','спиздоболил','сполохуйка','Стриппиздунчик','Выебнуться','ебанаш','шкура','Хуёво','баян','епать','баля','Сучёныш','Сучёнышь','Дилдак','Дилдо','ебланка','Трахаться','Трах','хуяндог','пиздоног','шмаль','Шваль','ахуевшая','ахуевший','Кобель','Путана','найух','моча','хуня','залупок','сучище','Сучарище','ска','нахой','kurwa','фак','пезда','хера','пропиздейшен','Спидоблять','пидарок','хуедрыг','хуетряс','Идиот','идиотка','далбоебина','давалка','пиздокрылоглаз','писькогрыз','Хуйкоглот','cock', 'cunt', 'fuck', 'fucker', 'fucking', 'отпиздит', 'архипиздрит', 'ахуел', 'ахуеть', 'бздение', 'бздеть', 'бздех', 'бздецы', 'бздит', 'бздицы', 'бздло', 'бзднуть', 'бздун', 'бздунья', 'бздюха', 'бздюшка', 'бздюшко', 'бля', 'блябу', 'блябуду', 'бляд', 'бляди', 'блядина', 'блядище', 'блядки', 'блядовать', 'блядство', 'блядун', 'блядуны', 'блядунья', 'блядь', 'блядюга', 'блять', 'вафел', 'вафлёр', 'взъебка', 'взьебка', 'взьебывать', 'въеб', 'въебался', 'въебенн', 'въебусь', 'въебывать', 'выблядок', 'выблядыш', 'выеб', 'выебать', 'выебен', 'выебнулся', 'выебон', 'выебываться', 'выпердеть', 'высраться', 'выссаться', 'вьебен', 'гавно', 'гавнюк', 'гавнючка', 'гамно', 'гандон', 'гнид', 'гнида', 'гниды', 'говенка', 'говенный', 'говешка', 'говназия', 'говнецо', 'говнище', 'говно', 'говноед', 'говнолинк', 'говночист', 'говнюк', 'говнюха', 'говнядина', 'говняк', 'говняный', 'говнять', 'гондон', 'доебываться', 'долбоеб', 'долбоёб', 'долбоящер', 'дрисня', 'дрист', 'дристануть', 'дристать', 'дристун', 'дристуха', 'дрочелло', 'дрочена', 'дрочила', 'дрочилка', 'дрочистый', 'дрочить', 'дрочка', 'дрочун', 'еб твою мать', 'ёб твою мать', 'ебал', 'ебало', 'ебальник', 'ебан', 'ебанамать', 'ебанат', 'ебаная', 'ёбаная', 'ебанический', 'ебанный', 'ебанныйврот', 'ебаное', 'ебануть', 'ебануться', 'ёбаную', 'ебаный', 'ебанько', 'ебарь', 'ебат', 'ёбат', 'ебатория', 'ебать', 'ебать-копать', 'ебаться', 'ебашить', 'ебёна', 'ебет', 'ебёт', 'ебец', 'ебик', 'ебин', 'ебись', 'ебическая', 'ебки', 'ебла', 'еблан', 'ебливый', 'еблище', 'ебло', 'еблыст', 'ебля', 'ёбн', 'ебнуть', 'ебнуться', 'ебня', 'ебошить', 'ебская', 'ебский', 'ебтвоюмать', 'ебун', 'ебут', 'ебуч', 'ебуче', 'ебучее', 'ебучий', 'ебучим', 'ебущ', 'ебырь', 'елда', 'елдак', 'елдачить', 'жопа', 'жопу', 'заговнять', 'задрачивать', 'задристать', 'задрота', 'заеб', 'заёб', 'заеба', 'заебал', 'заебанец', 'заебастая', 'заебастый', 'заебать', 'заебаться', 'заебашить', 'заебистое', 'заёбистое', 'заебистые', 'заёбистые', 'заебистый', 'заёбистый', 'заебись', 'заебошить', 'заебываться', 'залуп', 'залупа', 'залупаться', 'залупить', 'залупиться', 'замудохаться', 'запиздячить', 'засерать', 'засерун', 'засеря', 'засирать', 'засрун', 'захуячить', 'заябестая', 'злоеб', 'злоебучая', 'злоебучее', 'злоебучий', 'ибанамат', 'ибонех', 'изговнять', 'изговняться', 'изъебнуться', 'ипать', 'ипаться', 'ипаццо', 'Какдвапальцаобоссать', 'конча', 'курва', 'курвятник', 'лох', 'лошара', 'лошары', 'лошок', 'лярва', 'малафья', 'манда', 'мандавошек', 'мандавошка', 'мандавошки', 'мандей', 'мандень', 'мандеть', 'мандища', 'мандой', 'манду', 'мандюк', 'минет', 'минетчик', 'минетчица', 'млять', 'мокрощелка', 'мокрощёлка', 'мразь', 'мудаг', 'мудак', 'муде', 'мудель', 'мудеть', 'муди', 'мудил', 'мудила', 'мудистый', 'мудня', 'мудоеб', 'мудозвон', 'мудоклюй', 'на хер', 'на хуй', 'набздел', 'набздеть', 'наговнять', 'надристать', 'надрочить', 'наебать', 'наебет', 'наебнуть', 'наебнуться', 'наебывать', 'напиздел', 'напиздели', 'напиздело', 'напиздили', 'насрать', 'настопиздить', 'нахер', 'нахрен', 'нахуй', 'нахуйник', 'не ебет', 'не ебёт', 'невротебучий', 'невъебенно', 'нехира', 'нехрен', 'Нехуй', 'нехуйственно', 'ниибацо', 'ниипацца', 'ниипаццо', 'ниипет', 'никуя', 'нихера', 'нихуя', 'обдристаться', 'обосранец', 'обосрать', 'обосцать', 'обосцаться', 'обсирать', 'объебос', 'обьебать обьебос', 'однохуйственно', 'опездал', 'опизде', 'опизденивающе', 'остоебенить', 'остопиздеть', 'отмудохать', 'отпиздить', 'отпиздячить', 'отпороть', 'отъебись', 'охуевательский', 'охуевать', 'охуевающий', 'охуел', 'охуенно', 'охуеньчик', 'охуеть', 'охуительно', 'охуительный', 'охуяньчик', 'охуячивать', 'охуячить', 'очкун', 'падла', 'падонки', 'падонок', 'паскуда', 'педерас', 'педик', 'педрик', 'педрила', 'педрилло', 'педрило', 'педрилы', 'пездень', 'пездит', 'пездишь', 'пездо', 'пездят', 'пердануть', 'пердеж', 'пердение', 'пердеть', 'пердильник', 'перднуть', 'пёрднуть', 'пердун', 'пердунец', 'пердунина', 'пердунья', 'пердуха', 'пердь', 'переёбок', 'пернуть', 'пёрнуть', 'пидар', 'пидарас', 'пидарасы', 'пидары', 'пидор', 'пидорасы', 'пидорка', 'пидорок', 'пидоры', 'пидрас', 'пизда', 'пиздануть', 'пиздануться', 'пиздарваньчик', 'пиздато', 'пиздатое', 'пиздатый', 'пизденка', 'пизденыш', 'пиздёныш', 'пиздеть', 'пиздец', 'пиздит', 'пиздить', 'пиздиться', 'пиздишь', 'пиздища', 'пиздище', 'пиздобол', 'пиздоболы', 'пиздобратия', 'пиздоватая', 'пиздоватый', 'пиздолиз', 'пиздонутые', 'пиздорванец', 'пиздорванка', 'пиздострадатель', 'пизду', 'пиздуй', 'пиздун', 'пиздунья', 'пизды', 'пиздюга', 'пиздюк', 'пиздюлина', 'пиздюля', 'пиздят', 'пиздячить', 'писбшки', 'писька', 'писькострадатель', 'писюн', 'писюшка', 'по хуй', 'по хую', 'подговнять', 'подонки', 'подонок', 'подъебнуть', 'подъебнуться', 'поебать', 'поебень', 'поёбываает', 'поскуда', 'посрать', 'потаскуха', 'потаскушка', 'похер', 'похерил', 'похерила', 'похерили', 'похеру', 'похрен', 'похрену', 'похуй', 'похуист', 'похуистка', 'похую', 'придурок', 'приебаться', 'припиздень', 'припизднутый', 'припиздюлина', 'пробзделся', 'проблядь', 'проеб', 'проебанка', 'проебать', 'промандеть', 'промудеть', 'пропизделся', 'пропиздеть', 'пропиздячить', 'раздолбай', 'разхуячить', 'разъеб', 'разъеба', 'разъебай', 'разъебать', 'распиздай', 'распиздеться', 'распиздяй', 'распиздяйство', 'распроеть', 'сволота', 'сволочь', 'сговнять', 'секель', 'серун', 'серька', 'сестроеб', 'сикель', 'сирать', 'сирывать', 'соси', 'спиздел', 'спиздеть', 'спиздил', 'спиздила', 'спиздили', 'спиздит', 'спиздить', 'срака', 'сраку', 'сраный', 'сранье', 'срать', 'срун', 'ссака', 'ссышь', 'стерва', 'страхопиздище', 'сука', 'суки', 'суходрочка', 'сучара', 'сучий', 'сучка', 'сучко', 'сучонок', 'сучье', 'сцание', 'сцать', 'сцука', 'сцуки', 'сцуконах', 'сцуль', 'сцыха', 'сцышь', 'съебаться', 'сыкун', 'трахаеб', 'трахаёб', 'трахатель', 'ублюдок', 'уебать', 'уёбища', 'уебище', 'уёбище', 'уебищное', 'уёбищное', 'уебк', 'уебки', 'уёбки', 'уебок', 'уёбок', 'урюк', 'усраться', 'ушлепок', 'хамло', 'хер', 'херня', 'херовато', 'херовина', 'херовый', 'хитровыебанный', 'хитрожопый', 'хуе', 'хуё', 'хуевато', 'хуёвенький', 'хуевина', 'хуево', 'хуевый', 'хуёвый', 'хуек', 'хуёк', 'хуел', 'хуем', 'хуенч', 'хуеныш', 'хуенький', 'хуеплет', 'хуеплёт', 'хуепромышленник', 'хуерик', 'хуерыло', 'хуесос', 'хуесоска', 'хуета', 'хуетень', 'хуею', 'хуи', 'хуй', 'хуйком', 'хуйло', 'хуйня', 'хуйрик', 'хуище', 'хуля', 'хую', 'хуюл', 'хуя', 'хуяк', 'хуякать', 'хуякнуть', 'хуяра', 'хуясе', 'хуячить', 'целка', 'чмо', 'чмошник', 'чмырь', 'шалава', 'шалавой', 'шараёбиться', 'шлюха', 'шлюхой', 'шлюшка', 'ябывае', 'хуету', 'сукаблять'],
        {   'а' : ['a', '@'],
            'б' : ['6', 'b'],
            'в' : ['b', 'v'],
            'г' : ['r', 'g'],
            'д' : ['d', 'g'],
            'е' : ['e'],
            'ё' : ['е', 'e'],
            'ж' : ['zh', '*'],
            'з' : ['3', 'z'],
            'и' : ['u', 'i'],
            'й' : ['u', 'y', 'i'],
            'к' : ['k', 'i{', '|{'],
            'л' : ['l', 'ji'],
            'м' : ['m'],
            'н' : ['h', 'n'],
            'о' : ['o', '0'],
            'п' : ['n', 'p'],
            'р' : ['r', 'p'],
            'с' : ['c', 's'],
            'т' : ['m', 't'],
            'у' : ['y', 'u'],
            'ф' : ['f'],
            'х' : ['x', 'h', '}{'],
            'ц' : ['c', 'u,'],
            'ч' : ['ch'],
            'ш' : ['sh'],
            'щ' : ['sch'],
            'ь' : ['b'],
            'ы' : ['bi'],
            'э' : ['е', 'e'],
            'ю' : ['io'],
            'я' : ['ya']}
    )
    const regexp = new RegExp(`(^|[^a-zа-яё])(${words.join('|')})($|[^a-zа-яё])`, 'i');

    if (data.text && regexp.test(data.text)) {
         const regex = /^(?:@everyone).*?([\d]+).*?$/gm;
            var str = data.text;
            var str2 = str.replace(/@everyone/i, '')
            let cid = data.peerId;
            let uId = data.senderId;
            let chatUsersReq = await vk.api.messages.getConversationMembers({access_token: t1ken, peer_id: cid, v: v})
            let chatUsers = chatUsersReq.items
            var mes;
            let arr = chatUsers.map(el => el.member_id)
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] > 0) {
                    mes += ' @id' + JSON.stringify(arr[i]) + '(&#8300;)'
                } else mes += ' @club' + -JSON.stringify(arr[i]) + '(&#8300;)'
            }
            var text = String(mes).replace(/undefined/i, 'Ругнулся: ' + "@id" + uId + "(администратора)")
            var text = text.replace(/305738074/i, '1') // dont mention user, which id is 305738074
            data.reply(text)
    }

    return next()
});

vk.updates.hear(/^!rand/i, data => {
    let peer = data.peerId;
    let cid = data.peerId - 2e9
    let user = data.senderId;
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3 AND `botadmin` = 1" , [peer, user], async function (err, res, f) {
        if (res.length == 1) {
            let chatUsersReq = await api('messages.getConversationMembers', {access_token: t1ken, peer_id: peer, v: v})
            let chatUsers = chatUsersReq.response.items
            let arr = chatUsers.map(el => el.member_id)
            let id = arr[getRandomInRange(0, arr.length - 1)];
            vk.api.messages.removeChatUser({chat_id: cid, member_id: id, access_token: t1ken, v: v});
        } else data.reply('Эту команду может использовать только создатель беседы!')
    })
})

vk.updates.hear(/^@everyone/i, data => {
    let user1 = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user1], async function (err, admins, f) {
        if (admins.length == 1) {
            const regex = /^(?:@everyone).*?([\d]+).*?$/gm;
            var str = data.text;
            var str2 = str.replace(/@everyone/i, '')
            let cid = data.peerId;
            let uId = data.senderId;
            let chatUsersReq = await vk.api.messages.getConversationMembers({access_token: t1ken, peer_id: cid, v: v})
            let chatUsers = chatUsersReq.items
            var mes;
            let arr = chatUsers.map(el => el.member_id)
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] > 0) {
                    mes += ' @id' + JSON.stringify(arr[i]) + '(&#8300;)'
                } else mes += ' @club' + -JSON.stringify(arr[i]) + '(&#8300;)'
            }
            var text = String(mes).replace(/undefined/i, 'Объявление от ' + "@id" + uId + "(администратора)")
            var text = text.replace(/305738074/i, '1') // dont mention user, which id is 305738074
            data.reply(text)
        } else data.reply('Вы не администратор!')
    })
})

vk.updates.hear(/^!kick/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user], async function (err, admins, f) {
        if (admins.length == 1) {
            if ((data.replyMessage != undefined) || (data.forwards.length != 0) || ((data.replyMessage == undefined) && (data.forwards.length == 0))) {
                if ((data.replyMessage == undefined) && (data.forwards.length == 0)) {
                    const regex = /^(?:!kick).*?([\d]+).*?$/gm;
                    const str = data.text;
                    const m = regex.exec(str);
                    let cid = data.peerId - 2e9;
                    if (m != null) {
                        const user_kicked = m[1];
                        if (user != user_kicked) {
                            kick(peer, cid, user_kicked)
                        }
                    }
                } else if ((data.forwards.length == 0) && (data.replyMessage != undefined)) {
                    let cid = data.peerId - 2e9;
                    let user_kicked = data.replyMessage.senderId;
                    if (user_kicked != user) {
                        kick(peer, cid, user_kicked)
                    }
                } else if ((data.forwards.length != 0) && (data.replyMessage == undefined)) {
                    let cid = data.peerId - 2e9;
                    for (var i = 0; i < data.forwards.length; i++) {
                        let user_kicked = data.forwards[i].senderId
                        if (user_kicked > 1 && user_kicked != user) {
                            kick(peer, cid, user_kicked)
                        }
                    }
                }
            } else data.reply('Укажите пользователя, которого вы хотите кикнуть')
        }
    })
})

vk.updates.hear(/^!id/i, data => {
    let id;
    if (data.hasForwards == false && data.hasReplyMessage == false) id = data.message.from_id
    if (data.hasForwards == true && data.hasReplyMessage == false) id = data.forwards[0].senderId
    if (data.hasForwards == false && data.hasReplyMessage == true) id = data.replyMessage.senderId
    data.reply(id)
})

vk.updates.hear(/^\/q$/, data => {
    let chat_id = data.peerId - 2e9
    let userKick = data.senderId;
    vk.api.messages.removeChatUser({
        chat_id: chat_id,
        member_id: userKick,
        access_token: t1ken,
        v: v
    }).then(res => {
        if (res == 1) {
            data.reply(`Пока`)
        }
    }).catch(er => {
        data.reply(`Опа, ошибочка! \n\n Скорее всего Вы являетесь администратором либо создателем беседы, поэтому выйти невозможно :с`)
    })
})

vk.updates.hear(/(я спать|всем пока я спать)/i, data => {
    data.reply('споки зайка <3')
})

vk.updates.hear(/owner/i, data => {
    data.reply('Я раб Luca Vita 💔')
})

vk.updates.hear('/alive', data => {
    data.reply('живой')
})

vk.updates.hear('!help', data => {
    data.reply('💀Приветствую, я Лирика. Начни работать - !apply \n \n☠Вот список команд: \n🦌!admin - добавить администратора \n🐁!unadmin - снять администратора \n🐓!addspec - добавить спец. админа \n🐚!remspec - снять спец. админа \n🚫!ban - ЗАБАНИТЬ \n🆓!unban - это для слабаков \n❓!warn - дать выговор \n✅!unwarn - снять выговор \n🌈!kick - кикнуть пользотвателя ')
})

vk.updates.hear(/^!cid/i, data => {
    let peer = data.peerId;
    let cid = data.peerId - 2e9
    data.reply('ChatID: ' + cid + '\n PeerID: ' + peer)
})

vk.updates.hear(/^!reg/i, data => {
    let message = data.text
    let uIdReg = message.replace(/(\/|!)reg/i, '').replace(/(([a-zа-я]+:\/\/)?([\w\.]+\.[a-zа-я]{2,6}\.?)(\S)?)/gi, '')
    let uId = uIdReg.match(/[\w*](\w*)]?/i)
    try {
        if (uId != null) {
            let url = 'https://api.vk.com/method/users.get?access_token=' + t1ken + '&user_ids=' + uId[0] + '&name_case=gen&v=' + v
            axios.get(url)
                .then(res => {
                    let info = res.data.response[0]
                    let name = `${info.first_name} ${info.last_name}`
                    needle.get(`https://vk.com/foaf.php?id=${info.id}`, function (err, res) {
                        if (err) console.log(err)
                        let xml = res.body
                        let out = JSON.parse(parser.toJson(xml))["rdf:RDF"]["foaf:Person"]["ya:created"]["dc:date"] // Дата регистрации страницы

                        let unixCreated = moment(out).unix()
                        let tzReg = moment.unix(unixCreated).utcOffset(+3)
                        let age = getAgeText(unixCreated)
                        let created = tzReg.locale('ru').format('D MMMM YYYY, HH:mm')
                        data.reply(`Дата регистрации страницы ${name}:\n ${created}\n Возраст страницы: ${age}`)
                    })
                })
        } else if (data.forwards.length == 0 && data.replyMessage == undefined) {
            needle.get(`https://vk.com/foaf.php?id=${data.message.from_id}`, function (err, res) {
                if (err) console.log(err)
                let xml = res.body
                let out = JSON.parse(parser.toJson(xml))["rdf:RDF"]["foaf:Person"]["ya:created"]["dc:date"] // Дата регистрации страницы
                let unixCreated = moment(out).unix()
                let tzReg = moment.unix(unixCreated).utcOffset(+3)
                let age = getAgeText(unixCreated)
                let created = tzReg.locale('ru').format('D MMMM YYYY, HH:mm')
                data.reply(`Дата регистрации Вашей страницы:\n${created}\n Возраст страницы: ${age}`)
            })
        } else if (data.forwards.length != 0 && data.message.reply_message == undefined) {
            if (data.forwards[0].senderId > 0) {
                let url = 'https://api.vk.com/method/users.get?access_token=' + t1ken + '&user_ids=' + data.forwards[0].senderId + '&name_case=gen&v=' + v
                axios.get(url)
                    .then(res => {
                        let info = res.data.response[0]
                        let name = `${info.first_name} ${info.last_name}`
                        needle.get(`https://vk.com/foaf.php?id=${data.forwards[0].senderId}`, function (err, res) {
                            if (err) console.log(err)
                            let xml = res.body
                            let out = JSON.parse(parser.toJson(xml))["rdf:RDF"]["foaf:Person"]["ya:created"]["dc:date"] // Дата регистрации страницы
                            let unixCreated = moment(out).unix()
                            let tzReg = moment.unix(unixCreated).utcOffset(+3)
                            let age = getAgeText(unixCreated)
                            let created = tzReg.locale('ru').format('D MMMM YYYY, HH:mm')
                            data.reply(`Дата регистрации страницы ${name}:\n ${created}\n Возраст страницы: ${age}`)
                        })
                    })
            }
        } else if (data.forwards.length == 0 && data.replyMessage != undefined) {
            if (data.replyMessage.senderId > 0) {
                let url = 'https://api.vk.com/method/users.get?access_token=' + t1ken + '&user_ids=' + data.replyMessage.senderId + '&name_case=gen&v=' + v
                axios.get(url)
                    .then(res => {
                        let info = res.data.response[0]
                        let name = `${info.first_name} ${info.last_name}`
                        needle.get(`https://vk.com/foaf.php?id=${data.replyMessage.senderId}`, function (err, res) {
                            if (err) console.log(err)
                            let xml = res.body
                            let out = JSON.parse(parser.toJson(xml))["rdf:RDF"]["foaf:Person"]["ya:created"]["dc:date"] // Дата регистрации страницы
                            let unixCreated = moment(out).unix()
                            let tzReg = moment.unix(unixCreated).utcOffset(+3)
                            let age = getAgeText(unixCreated)
                            let created = tzReg.locale('ru').format('D MMMM YYYY, HH:mm')
                            data.reply(`Дата регистрации страницы ${name}:\n ${created}\n Возраст страницы: ${age}`)
                        })
                    })
            }
        }
    } catch (er) {
        data.reply(er.message)
    }
})


vk.updates.hear(/^!apply/i, data => {
    let peer = data.peerId;
    let user = data.senderId;
    vk.api.messages.getConversationsById({ peer_ids: peer, access_token: t1ken, v: v }) .then(res => {
        if(res.count != 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `status` = 3 AND `botadmin` = 1" , [peer, user], function (err, ress, f) {
                if (ress.length == 0){
                    let user_id = res.items[0].chat_settings.owner_id
                    connection.query("INSERT INTO `admins` (`peer`, `userid`, `status`, `botadmin`) VALUES (?, ?, ?, ?);" , [peer, user_id, 3, 1], function (error, result, fields) {
                        data.reply('Бот успешно проверил наличие прав администратора, создателю беседы выданы права администратора, для выдачи прав другому человеку используйте !admin @id. Приятного использования, с любовью, ваш Pacmard (автор бота)')
                    });
                } else data.reply('Бот уже проверил наличие прав администратора и выдал полномочия создателю беседы, повторная проверка не требуется, пожалуйста, не используйте данную команду без надобности.')
            });
        } else data.reply('Бот все еще не администратор. Выдайте права администратора для его полноценного функционирования.')
    })
})

vk.updates.hear(/^!ban/i, data => {
    let peer = data.peerId;
    let user = data.senderId;
    const regex = /^(?:!ban).*?([\d]+).*?$/gm;
    const str = data.text
    const m = regex.exec(str);
    if (m != null) {
        const user_id = m[1];
        connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user], async function (err, admins, f) {
            if (admins.length == 1) {
                connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user_id], async function (err, creator, f) {
                    if (creator.length == 0) {
                        connection.query("SELECT * FROM `bans` WHERE `peer` = ? AND `userid` = ?", [peer, user_id], async function (err, alreadybanned, f) {
                            if (alreadybanned.length == 0) {
                                connection.query("INSERT INTO `bans` (`peer`, `userid`) VALUES (?, ?);", [peer, user_id], function (error, result, fields) {
                                    let cid = data.peerId - 2e9
                                    vk.api.messages.removeChatUser({
                                        chat_id: cid,
                                        member_id: user_id,
                                        access_token: t1ken,
                                        v: v
                                    });
                                    data.reply('Пользователь успешно заблокирован!')
                                })
                            } else data.reply('Пользователь уже заблокирован!')
                        })
                    } else data.reply('Вы не можете заблокировать администратора!')
                })
            } else data.reply('Вы не администратор!')
        })
    } else data.reply('Укажите, какого пользователя Вы хотите заблокировать через упоминание!')
})

vk.updates.hear(/^!unban/i, data => {
    let peer = data.peerId;
    let user = data.senderId;
    const regex = /^(?:!unban).*?([\d]+).*?$/gm;
    const str = data.text
    const m = regex.exec(str);
    if (m != null) {
        const user_id = m[1];
        connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user], async function (err, admins, f) {
            if (admins.length == 1) {
                connection.query("SELECT * FROM `bans` WHERE `peer` = ? AND `userid` = ?", [peer, user_id], async function (err, alreadybanned, f) {
                    if (alreadybanned.length == 1) {
                        connection.query("DELETE FROM `bans` WHERE `bans`.`id` = ?;", [alreadybanned[0].id], async function (err, ress22, f) {
                            data.reply('Пользователь разблокирован!')
                        })
                    } else data.reply('Пользователь не заблокирован!')
                })
            } else data.reply('Вы не являетесь администратором!')
        })
    } else data.reply('Укажите пользователя, которого нужно разблокировать!')
})


vk.updates.hear(/^!кикатьвышедших/i, data => {
    let peer = data.peerId;
    let user = data.senderId;
    let commandor = 'exitkick'
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3 AND `botadmin` = 1", [peer, user], async function (err, admins, f) {
        if(admins.length == 1){
            connection.query("SELECT * FROM `commands` WHERE `peer` = ? AND `command` = ? AND `status` = 1", [peer, commandor], async function (err, chkcmd, f) {
                if(chkcmd.length == 1){
                    connection.query("UPDATE `commands` SET `status` = '0' WHERE `commands`.`id` = ?;", [chkcmd[0].id], function (error, result, fields) {
                        data.reply('Теперь вышедшие пользователи не будут автоматически исключаться из беседы!')
                    })
                } else {
                    connection.query("SELECT * FROM `commands` WHERE `peer` = ? AND `command` = ? AND `status` = 0", [peer, commandor], async function (err, chkcmd2, f) {
                        if(chkcmd2.length == 1){
                            connection.query("UPDATE `commands` SET `status` = '1' WHERE `commands`.`id` = ?;", [chkcmd2[0].id], function (error, result, fields) {
                                data.reply('Теперь вышедшие пользователи будут автоматически исключаться из беседы!')
                            })
                        } else {
                            connection.query("INSERT INTO `commands` (`peer`, `command`, `status`) VALUES (?, ?, ?);", [peer, commandor, 1], function (error, result, fields) {
                                data.reply('Теперь вышедшие пользователи будут автоматически исключаться из беседы!')
                            })
                        }
                    })
                }
            })
        } else data.reply('Вы не являетесь создателем данной беседы!')
    })
})

vk.updates.hear(/^!admin/i, data => {
    let peer = data.peerId;
    let user = data.senderId;
    const regex = /^(?:!admin|!админ).*?([\d]+).*?$/gm;
    const str = data.text;
    const m = regex.exec(str);
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3 AND `botadmin` = 1", [peer, user], function (err, res, f) {
        if (res.length == 1) {
            if (m.length != null) {
                const user_id = m[1];
                if (user != user_id) {
                    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user_id], function (err, alreadyadm, f) {
                        if (alreadyadm.length == 0) {
                            connection.query("INSERT INTO `admins` (`peer`, `userid`, `status`) VALUES (?, ?, ?);", [peer, user_id, 3], function (error, result, fields) {
                                data.reply('Права администратора были успешно выданы!')
                            })
                        } else data.reply('Пользователь уже администратор!')
                    })
                } else data.reply('Вы не можете выдать права администратора самому себе, вы и так администратор.')
            } else data.reply('Укажите пользователя, которому необходимо выдать права администратора через упоминание.')
        }
    });
});

vk.updates.hear(/^!unadmin/i, data => {
    let peer = data.peerId;
    let user = data.senderId;
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3 AND `botadmin` = 1", [peer, user], async function (err, admins, f) {
        if (admins.length == 1) {
            const regex = /^(?:!unadmin).*?([\d]+).*?$/gm;
            const str = data.text;
            const m = regex.exec(str);
            if (m != null) {
                const user_id = m[1];
                if (user_id != admins[0].userid) {
                    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user_id], async function (err, ress11, f) {
                        if (ress11.length == 1) {
                            connection.query("DELETE FROM `admins` WHERE `admins`.`id` = ?;", [ress11[0].id], async function (err, ress22, f) {
                                data.reply('С пользователя успешно сняты права администратора!')
                            })
                        } else data.reply('Пользователь не является администратором!')
                    })
                } else data.reply('Вы не можете снять права администратора с себя!')
            } else data.reply('Упомяните пользователя с которого нужно снять права администратора!')
        } else data.reply('Вы не являетесь создателем беседы для этого действия!')
    })
});

vk.updates.hear(/^!addspec/i, data => {
    let peer = data.peerId;
    let user = data.senderId;
    const regex = /^(?:!addspec).*?([\d]+).*?$/gm;
    const str = data.text;
    const m = regex.exec(str);
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3 AND `botadmin` = 1 AND `creator` = 1", [peer, user], function (err, res, f) {
        if (res.length == 1) {
            if (m.length != null) {
                const user_id = m[1];
                if (user != user_id) {
                    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user_id], function (err, alreadyadm, f) {
                        if (alreadyadm.length == 0) {
                            connection.query("INSERT INTO `admins` (`peer`, `userid`, `status`, botadmin) VALUES (?, ?, ?, ?);", [peer, user_id, 3, 1], function (error, result, fields) {
                                data.reply('Права спец.администратора были успешно выданы!')
                            })
                        } else connection.query("UPDATE `admins` SET `botadmin` = '1' WHERE `admins`.`id` = ?;", [alreadyadm[0].id], function (error, result, fields) {
                            data.replt('Пользователь успешно повышен до спец.администратора!')
                        })
                    })
                } else data.reply('Вы не можете выдать права спец.администратора самому себе, вы и так администратор.')
            } else data.reply('Укажите пользователя, которому необходимо выдать права спец.администратора через упоминание.')
        }
    });
});

vk.updates.hear(/^!remspec/i, data => {
    let peer = data.peerId;
    let user = data.senderId;
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3 AND `botadmin` = 1 AND `creator` = 1", [peer, user], async function (err, admins, f) {
        if (admins.length == 1) {
            const regex = /^(?:!remspec).*?([\d]+).*?$/gm;
            const str = data.text;
            const m = regex.exec(str);
            if (m != null) {
                const user_id = m[1];
                if (user_id != admins[0].userid) {
                    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3 AND `botadmin` = 1", [peer, user_id], async function (err, ress11, f) {
                        if (ress11.length == 1) {
                            connection.query("DELETE FROM `admins` WHERE `admins`.`id` = ?;", [ress11[0].id], async function (err, ress22, f) {
                                data.reply('С пользователя успешно сняты права спец.администратора!')
                            })
                        } else data.reply('Пользователь не является спец.администратором!')
                    })
                } else data.reply('Вы не можете снять права спец.администратора с себя!')
            } else data.reply('Упомяните пользователя с которого нужно снять права спец.администратора!')
        } else data.reply('Вы не являетесь создателем беседы для этого действия!')
    })
});

vk.updates.hear(/^!warn/i, async data => {
    let peer = data.peerId;
    let user = data.senderId;
    await data.loadMessagePayload();
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user], async function (err, admins, f) {
        if (admins.length == 1) {
            if ((data.replyMessage != undefined) || (data.forwards.length != 0) || ((data.replyMessage == undefined) && (data.forwards.length == 0))) {
                if ((data.replyMessage == undefined) && (data.forwards.length == 0)) {
                    const regex = /^(?:!warn).*?([\d]+).*?$/gm;
                    const str = data.text;
                    const m = regex.exec(str);
                    let cid = data.peerId - 2e9;
                    if (m != null) {
                        const user_warned = m[1];
                        if (user != user_warned) {
                            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user_warned], async function (err, kickadmin, f) {
                                if (kickadmin.length == 0) {
                                    givewarn(data, peer, user_warned, cid)
                                } else data.reply('Вы не можете дать предупреждение администратору!')
                            })
                        }
                    }
                } else if ((data.forwards.length == 0) && (data.replyMessage != undefined)) {
                    let cid = data.peerId - 2e9;
                    let user_warned = data.replyMessage.senderId;
                    if (user_warned != user) {
                        connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user_warned], async function (err, kickadmin1, f) {
                            if (kickadmin1 == 0) {
                                givewarn(data, peer, user_warned, cid)
                            } else data.reply('Вы не можете дать предупреждение администратору!')
                        })
                    }
                } else if ((data.forwards.length != 0) && (data.replyMessage == undefined)) {
                    let cid = data.peerId - 2e9;
                    for (var i = 0; i < data.forwards.length; i++) {
                        let user_warned = data.forwards[i].senderId
                        if (user_warned > 1 && user_warned != user) {
                            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user_warned], async function (err, kickadmin2, f) {
                                if (kickadmin2 == 0) {
                                    givewarn(data, peer, user_warned, cid)
                                } else data.reply('Вы не можете дать предупреждение администратору!')
                            })
                        }
                    }
                }
            } else data.reply('Укажите пользователя, которому надо дать предупреждение!')
        }
    })
})

vk.updates.hear(/^!unwarn/i, async data => {
    let peer = data.peerId;
    let user = data.senderId;
    await data.loadMessagePayload();
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user], async function (err, admins, f) {
        if (admins.length == 1) {
            if ((data.replyMessage != undefined) || (data.forwards.length != 0) || ((data.replyMessage == undefined) && (data.forwards.length == 0))) {
                if ((data.replyMessage == undefined) && (data.forwards.length == 0)) {
                    const regex = /^(?:!unwarn).*?([\d]+).*?$/gm;
                    const str = data.text;
                    const m = regex.exec(str);
                    let cid = data.peerId - 2e9;
                    if (m != null) {
                        const user_unwarned = m[1];
                        if (user != user_unwarned) {
                            removewarn(data, peer, user_unwarned)
                        }
                    }
                } else if ((data.forwards.length == 0) && (data.replyMessage != undefined)) {
                    let cid = data.peerId - 2e9;
                    let user_unwarned = data.replyMessage.senderId;
                    if (user_unwarned != user) {
                        removewarn(data, peer, user_unwarned)
                    }
                } else if ((data.forwards.length != 0) && (data.replyMessage == undefined)) {
                    let cid = data.peerId - 2e9;
                    for (var i = 0; i < data.forwards.length; i++) {
                        let user_unwarned = data.forwards[i].senderId
                        if (user_unwarned > 1 && user_unwarned != user) {
                            removewarn(data, peer, user_unwarned)
                        }
                    }
                }
            } else data.reply('Укажите пользователя, которому надо дать предупреждение!')
        }
    })
})

vk.updates.hear(/^!warns/i, async data => {
    let peer = data.peerId;
    let user = data.senderId;
    await data.loadMessagePayload();
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user], async function (err, admins, f) {
        if (admins.length == 1) {
            if ((data.replyMessage != undefined) || (data.forwards.length != 0) || ((data.replyMessage == undefined) && (data.forwards.length == 0))) {
                if ((data.replyMessage == undefined) && (data.forwards.length == 0)) {
                    const regex = /^(?:!warns).*?([\d]+).*?$/gm;
                    const str = data.text;
                    const m = regex.exec(str);
                    let cid = data.peerId - 2e9;
                    if (m != null) {
                        const user_chk = m[1];
                        checkwrn(data, peer, user_chk)
                    }
                } else if ((data.forwards.length == 0) && (data.replyMessage != undefined)) {
                    let cid = data.peerId - 2e9;
                    let user_chk = data.replyMessage.senderId;
                    checkwrn(data, peer, user_chk)
                } else if ((data.forwards.length != 0) && (data.replyMessage == undefined)) {
                    let cid = data.peerId - 2e9;
                    for (var i = 0; i < data.forwards.length; i++) {
                        let user_chk = data.forwards[i].senderId
                        checkwrn(data, peer, user_chk)
                    }
                }
            } else data.reply('Укажите пользователя, которому надо дать предупреждение!')
        }
    })
})

vk.updates.start().catch(console.error);

var yearName = ['год', 'года', 'лет']
var dayname = ['день', 'дня', 'дней'];
var hourname = ['час', 'часа', 'часов'];
var minname = ['минута', 'минуты', 'минут'];
var secname = ['секунда', 'секунды', 'секунд'];

function CheckNumber(number) {
    var number = number;
    var b = number % 10; var a = (number % 100 - b) / 10;
    if (a == 0 || a >= 2) {
        if (b == 0 || (b > 4 && b <= 9)) { return 2; } else { if (b != 1) { return 1; } else { return 0; } }
    }
    else { return 2; }
}

function getAgeText(dateUnix) {
    let actUnix = moment().unix()
    let diffUnux = actUnix - dateUnix
    let y, d, residue = ''
    y = Math.floor(diffUnux / 31556926)
    residue = (y * 31556926) - diffUnux
    if (residue < 0) residue = residue - residue - residue
    d = Math.round(residue / 86400)
    if (d == 365) d = 0, y++

    let mes = `${y} ${yearName[CheckNumber(y)]} и ${d} ${dayname[CheckNumber(d)]}`
    if (y == 0) mes = `${d} ${dayname[CheckNumber(d)]}`
    if (d == 0) mes = `${y} ${yearName[CheckNumber(y)]}`
    if (d == 0 && y == 0) mes = `0 лет и 0 дней`
    return (mes);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var declOfNum = (function () {
    var cases = [2, 0, 1, 1, 1, 2];
    var declOfNumSubFunction = function (titles, number) {
        number = Math.abs(number);
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }
    return function (_titles) {
        if (arguments.length === 1) {
            return function (_number) {
                return declOfNumSubFunction(_titles, _number)
            }
        } else {
            return declOfNumSubFunction.apply(null, arguments)
        }
    }
})()

function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function givewarn(data, peer, user_warned, cid) {
    connection.query("SELECT * FROM `warns` WHERE `peer` = ? AND `userid` = ?", [peer, user_warned], async function (err, chkwrn, f) {
        if (chkwrn.length == 1) {
            if (chkwrn[0].number == 1) {
                let nwrn = chkwrn[0].number + 1;
                connection.query("UPDATE `warns` SET `number` = ? WHERE `warns`.`id` = ?;", [nwrn, chkwrn[0].id], function (error, result, fields) {
                    data.reply('Вам вынесено второе предупреждение, в следующий раз Вы будете исключены из чата и программы! Старайтесь не нарушать!')
                })
            } else if (chkwrn[0].number == 2){
                connection.query("UPDATE `warns` SET `number` = ? WHERE `warns`.`id` = ?;", [3, chkwrn[0].id], function (error, result, fields) {
                    data.reply('Мы неоднократно выносили Вам предупреждения. Вы будете исключены за большое количество нарушений. Удачи!')
                    vk.api.messages.removeChatUser({
                        chat_id: cid,
                        member_id: user_warned,
                        access_token: t1ken,
                        v: v
                    });
                })
            } else if (chkwrn[0].number == 0){
                connection.query("UPDATE `warns` SET `number` = ? WHERE `warns`.`id` = ?;", [1, chkwrn[0].id], function (error, result, fields) {
                    data.reply('Вам вынесено первое предупреждение, когда их будет 3 Вы будете исключены из чата и программы! Старайтесь не нарушать!')
                })
            }
        } else {
            connection.query("INSERT INTO `warns` (`peer`, `userid`, `number`) VALUES (?, ?, ?);", [peer, user_warned, 1], function (error, result, fields) {
                data.reply('Вам вынесено первое предупреждение, когда их будет 3 Вы будете исключены из чата и программы! Старайтесь не нарушать!')
            })
        }
    })
}

function removewarn(data, peer, user_unwarned) {
    connection.query("SELECT * FROM `warns` WHERE `peer` = ? AND `userid` = ?", [peer, user_unwarned], async function (err, chkwrn, f) {
        if (chkwrn.length == 1) {
            if (chkwrn[0].number <= 3 && chkwrn[0].number != 0) {
                let nwrn = chkwrn[0].number - 1;
                connection.query("UPDATE `warns` SET `number` = ? WHERE `warns`.`id` = ?;", [nwrn, chkwrn[0].id], function (error, result, fields) {
                    data.reply('Пользователю снято одно предупреждение. Теперь у него их ' + nwrn + '. #user' + user_unwarned)
                })
            } else {
                data.reply('У пользователя нет предупреждений!')
            }
        }
    })
}

function checkwrn(data, peer, user_chk) {
    connection.query("SELECT * FROM `warns` WHERE `peer` = ? AND `userid` = ?", [peer, user_chk], async function (err, chkwrn, f) {
        if (chkwrn.length == 1) {
            if (chkwrn[0].number <= 3 && chkwrn[0].number != 0) {
                data.reply('У пользователя ' + chkwrn[0].number + ' предупреждения(е)')
            } else data.reply('У пользователя нет предупреждений!')
        } else data.reply('У пользователя нет предупреждений!')
    })
}

function kick(peer, cid, user_kicked) {
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user_kicked], async function (err, kickadmin2, f) {
        if (kickadmin2 == 0) {
            vk.api.messages.removeChatUser({
                chat_id: cid,
                member_id: user_kicked,
                access_token: t1ken,
                v: v
            });
        } else data.reply('Вы не можете кикнуть администратора!')
    })
}

function escapeRegExpText(text) {
    return text.replace(
        /(\*|\{|\})/g,
        '\\$1'
    );
}

function transformWords(words, hooks) {
    const newWords = [];

    for (let word of words) {
        const checkedSymbols = new Set();
        for (const symbol of word) {
            const replaces = hooks[symbol];
            if (replaces && !checkedSymbols.has(symbol)) {
                checkedSymbols.add(symbol);
                const validSymbol = escapeRegExpText(symbol);
                const validReplaces = escapeRegExpText(replaces.join('|'));
                word = word.replace(
                    new RegExp(validSymbol, 'gi'),
                    `(${validSymbol}|${validReplaces})`
                );
            }
        }
        newWords.push(word);
    }
    return newWords;
}
