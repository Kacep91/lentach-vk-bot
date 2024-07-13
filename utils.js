import { VK, Keyboard } from 'vk-io';
import fs from 'fs';
import { randomInt } from 'crypto';
export let lastMessageTimestamp = {}; // Объект для хранения времени последнего сообщения от пользователя

export const groupId = 29534144;
export const access_token = `vk1.a.M__d9kfi-K-02WBNxDwDnwhMLbpQf3NMvhDwsFqyL2r1lOfbYFfjtR4wdd0yJDfI9CCuWnB0x17dXojcV-A3ORRWmzbh0visWvKbW5pOqR7P0qF5FNQmy-lo-_vh6KUUTPD1b8qQSK9zsR0DxLPCs1eurQkOzDNlJ1Qtp-aMjE4ORPP68_SrWI-FbBxntfM_BCsfHJ_BGQ_k3dcGYX8YHA`;

export const vk = new VK({
    token: access_token,
    pollingGroupId: groupId
});


const userTimers = {}; // Объект для хранения таймеров пользователей

const keyboardCancelRegistration = Keyboard.keyboard([
    Keyboard.textButton({
        label: '!Отменить регистрацию на игру',
        color: Keyboard.NEGATIVE_COLOR
    }),
    Keyboard.textButton({
        label: '!Правила игры',
        color: Keyboard.PRIMARY_COLOR
    })
])

const keyboardRules = Keyboard.keyboard([
    Keyboard.textButton({
        label: '!Правила игры',
        color: Keyboard.PRIMARY_COLOR
    })
])

export const greetedUsers = fs.existsSync('greetedUsers.json') ? JSON.parse(fs.readFileSync('greetedUsers.json')) : [];
export const adminIds = [5720735, 710320271, 528604423, 472830827, 577130021, 178488636, 276385455, 329805700];//710320271
export const users = fs.existsSync('users.json') ? JSON.parse(fs.readFileSync('users.json')) : [];
export const usersAgreement = fs.existsSync('usersAgreement.json') ? JSON.parse(fs.readFileSync('usersAgreement.json')) : [];
export const saveUsers = async () => fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
export const saveUserAgreement = async () => fs.writeFileSync('usersAgreement.json', JSON.stringify(usersAgreement, null, 2));
export const saveGreetedUsers = async () => fs.writeFileSync('greetedUsers.json', JSON.stringify(greetedUsers, null, 2));

export let teams = {
    purple: [],
    white: []
};

export const queue = [];
export let game = {
    id: null,
    players: [],
    purple: [],
    white: [],
    winner: null
};

export async function saveWinnerTeam(team) {
    console.log('saveWinnerTeam game', game);
    console.log('saveWinnerTeam teams', teams);

    const otherTeam = team === 'white' ? 'purple' : 'white'

    const winnerTeam = teams[team];
    const loserTeam = teams[otherTeam];

    for (const player of winnerTeam) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Задержка в 0,5 секунд
        await vk.api.messages.send({
            user_id: String(player?.userId).length > 1 ? player?.userId : 5720735,
            random_id: randomInt(1000000),
            message: `Поздравляем! Ваша команда победила!\nПолучи свой приз - стикерную ленту и сфотографируйся в Лентач фотобудке\nПодписывайся на нас в Телеграм!\n`,
            keyboard: Keyboard.keyboard([
                Keyboard.urlButton({
                    label: 'Подписаться на Телеграм',
                    url: 'https://t.me/oldlentach'
                }),
                Keyboard.textButton({
                    label: '!Регистрация на игру',
                    color: Keyboard.POSITIVE_COLOR
                })
            ])
        });
        // Проверка времени слота относительно текущего времени
        if (userTimers[player?.userId]) {
            clearTimeout(userTimers[player?.userId].tShirtTimer);
        }
        userTimers[player?.userId] = {};
        userTimers[player?.userId].tShirtTimer = setTimeout(async () => {
            await context.send(`Мемный Петанк — это соревнование не только по петанку, но и по постингу.\n
Чтобы выиграть стикер-пак с отборными мемами Лентача выкладывайте в VK  фото и видео с хештегом  #мемныйпетанк.\n

А еще по секрету: каждая 15-ая команда получит футболку с мемами из бест-оф-зе-бест коллекции — только тссс!\n

Желаем вам приятного Мемного Петанка!\n`);
        }, 5 * 60000);
    }

    for (const player of loserTeam) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Задержка в 0,5 секунд
        await vk.api.messages.send({
            user_id: String(player?.userId).length > 1 ? player?.userId : 5720735,
            random_id: randomInt(1000000),
            message: `Спасибо за участие!\nПолучи свой приз - стикерную ленту и сфотографируйся в Лентач фотобудке\nПодписывайся на нас в Телеграм!\n`,
            keyboard: Keyboard.keyboard([
                Keyboard.urlButton({
                    label: 'Подписаться на Телеграм',
                    url: 'https://t.me/oldlentach'
                }),
                Keyboard.textButton({
                    label: '!Регистрация на игру',
                    color: Keyboard.POSITIVE_COLOR
                })
            ])
        });
        // Проверка времени слота относительно текущего времени
        if (userTimers[player?.userId]) {
            clearTimeout(userTimers[player?.userId]?.tShirtTimer);
        }

        userTimers[player?.userId] = {};
        userTimers[player?.userId].tShirtTimer = setTimeout(async () => {
            await context.send(`Мемный Петанк — это соревнование не только по петанку, но и по постингу.\n
Чтобы выиграть стикер-пак с отборными мемами Лентача выкладывайте в VK  фото и видео с хештегом  #мемныйпетанк.\n

А еще по секрету: каждая 15-ая команда получит футболку с мемами из бест-оф-зе-бест коллекции — только тссс!\n

Желаем вам приятного Мемного Петанка!\n`);
        }, 5 * 60000);
    }
    game = { ...game, winner: team }
    winnerList.push(game)
    await fs.writeFileSync('winners.json', JSON.stringify(winnerList, null, 2));
    game = {
        id: null,
        players: [],
        purple: [],
        white: [],
        winner: null
    }
    teams.purple = [];
    teams.white = [];
    await checkAndAddPlayersFromQueue();
    return;
}

export const winnerList = fs.existsSync('winners.json') ? JSON.parse(fs.readFileSync('winners.json')) : [];

export async function startGame() {
    if ((teams['purple'].length + teams['white'].length) >= 2) {
        const gameNumber = winnerList?.length + 1;
        game = {
            id: gameNumber,
            timestamp: new Date().toISOString(),
            players: [...teams['purple'], ...teams['white']],
            purple: teams['purple'],
            white: teams['white'],
            winner: null
        };


        const whiteTeamComposition = teams['white']?.map(item => {
            const userFound = users?.find(user => user.userId === item?.userId);
            return `${userFound?.firstName || 'NoName'} ${userFound?.lastName || 'NoName'} ID: ${userFound?.userId || item}`;
        });

        const purpleTeamComposition = teams['purple']?.map(item => {
            const userFound = users?.find(user => user.userId === item?.userId);
            return `${userFound?.firstName || 'NoName'} ${userFound?.lastName || 'NoName'} ID: ${userFound?.userId || item}`;
        });

        try {// Отправка сообщения администратору
            for (const adminId of adminIds) {
                await new Promise(resolve => setTimeout(resolve, 500)); // Задержка в 0,5 секунд
                await vk.api.messages.send({
                    user_id: adminId,
                    random_id: randomInt(1000000),
                    message: `${gameNumber % 15 === 0 ? 'Не забудь, что за каждую 15 игру мы дарим участникам футболки' : ''}\n\n Начинается Игра №${gameNumber}\n Состав команд (${(teams['purple'].length + teams['white'].length)} игроков):\n Фиолетовая:\n ${purpleTeamComposition?.join('\n')}\n Белая:\n ${whiteTeamComposition?.join('\n')}\n`,
                    keyboard: Keyboard.builder()
                        .textButton({ label: '!Старт игры' })
                        .textButton({ label: '!Отмена игры' })
                });
            }
        } catch (error) {
            console.log('error 1', error);
        }
    }
}

export async function handleJoinTeam(context) {
    console.log('handleJoinTeam teams', teams)
    const userId = context.senderId
    // Проверка, находится ли пользователь уже в одной из команд
    const isInPurpleTeam = teams.purple.some(player => player.userId === userId);
    const isInWhiteTeam = teams.white.some(player => player.userId === userId);

    if (isInPurpleTeam || isInWhiteTeam) {
        await context.send('Вы уже находитесь в одной из команд.', { keyboard: keyboardCancelRegistration });
        return;
    }
    // Определяем, в какую команду добавить игрока
    const teamToJoin = teams.purple.length <= teams.white.length ? 'purple' : 'white';

    // Получаем текущее время в МСК
    const mskTime = new Date(new Date().getTime() + 3 * 60 * 60 * 1000).toISOString();

    // Создаем объект для очереди
    const queueItem = {
        userId: context.senderId,
        team: teamToJoin,
        timestamp: mskTime
    };

    if (teams[teamToJoin].length < 3) {
        teams[teamToJoin].push({ userId: context.senderId });
        await context.send(`Поздравляем, ты успешно обладаешь местом в команде ${teamToJoin === 'purple' ? 'Фиолетовых' : 'Белых'} Мемного петанка. Хорошего петанка!`, { keyboard: keyboardCancelRegistration });

        await context.send(`Мемный Петанк — это соревнование не только по петанку, но и по постингу.\n
Чтобы выиграть стикер-пак с отборными мемами Лентача выкладывайте в VK  фото и видео с хештегом  #мемныйпетанк.\n

А еще по секрету: каждая 15-ая команда получит футболку с мемами из бест-оф-зе-бест коллекции — только тссс!\n

Желаем вам приятного Мемного Петанка!\n`, { keyboard: keyboardCancelRegistration });
    } else {
        queue.push(queueItem);
        await context.send(`Ты записан/-а. Не на диктофон, а в лист ожидания.\nКак только освободится место, отправим в этот чат весточку.`, { keyboard: keyboardRules });
    }

    // Проверяем, можно ли добавить игроков из очереди
    if (queue.length > 0 && (teams['purple'].length < 3 || teams['white'].length < 3)) {
        !teams.purple.some(player => player.userId === nextPlayer?.userId) && !teams.white.some(player => player.userId === nextPlayer?.userId) && (await checkAndAddPlayersFromQueue());
    } else {
        await startGame();
    }
}

export async function checkAndAddPlayersFromQueue() {
    // Сортируем очередь по времени регистрации
    queue.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    while ((teams['purple'].length < 3 || teams['white'].length < 3) && queue.length > 0) {
        const nextPlayer = queue.shift();
        const teamToJoin = teams.purple.length <= teams.white.length ? 'purple' : 'white';

        // Проверка, находится ли пользователь уже в одной из команд

        console.log('checkAndAddPlayersFromQueue teams', teams)
        if (teams.purple.some(player => player.userId === nextPlayer?.userId) || teams.white.some(player => player.userId === nextPlayer?.userId)) {
            await vk.api.messages.send({
                user_id: nextPlayer.userId,
                random_id: randomInt(1000000),
                message: 'Вы уже находитесь в одной из команд. 2',
                keyboard: keyboardCancelRegistration
            });
            return;
        }

        if (teams[teamToJoin].length < 3) {
            teams[teamToJoin].push(nextPlayer);

            // Отправляем сообщение игроку о добавлении в команду
            if (nextPlayer?.userId) {
                await new Promise(resolve => setTimeout(resolve, 500)); // Задержка в 0,5 секунд
                await vk.api.messages.send({
                    user_id: nextPlayer.userId,
                    random_id: randomInt(1000000),
                    message: `Поздравляем, ты успешно обладаешь местом в команде ${teamToJoin === 'purple' ? 'Фиолетовых' : 'Белых'} Мемного петанка. Хорошего петанка!`,
                    keyboard: keyboardCancelRegistration
                });
                await new Promise(resolve => setTimeout(resolve, 500)); // Задержка в 0,5 секунд
                await vk.api.messages.send({
                    user_id: nextPlayer.userId,
                    random_id: randomInt(1000000),
                    message: `Мемный Петанк — это соревнование не только по петанку, но и по постингу.\n
Чтобы выиграть стикер-пак с отборными мемами Лентача выкладывайте в VK  фото и видео с хештегом  #мемныйпетанк.\n

А еще по секрету: каждая 15-ая команда получит футболку с мемами из бест-оф-зе-бест коллекции — только тссс!\n

Желаем вам приятного Мемного Петанка!\n`,
                    keyboard: keyboardCancelRegistration
                });
            }
        } else {
            // Если обе команды заполнены, возвращаем игрока обратно в очередь
            queue.unshift(nextPlayer);
            await new Promise(resolve => setTimeout(resolve, 500)); // Задержка в 0,5 секунд
            await vk.api.messages.send({
                user_id: nextPlayer.userId,
                random_id: randomInt(1000000),
                message: `Ты записан/-а. Не на диктофон, а в лист ожидания.\nКак только освободится место, отправим в этот чат весточку. А пока мем скрасит ожидание:\n`,
                keyboard: keyboardRules
            });
            break;
        }
    }

    if ((teams['purple'].length + teams['white'].length) >= 3) {
        await startGame();
    }
}

export const clearGame = async () => {
    game = {
        id: null,
        players: [],
        purple: [],
        white: [],
        winner: null
    }
    teams.purple = [];
    teams.white = [];
    return;
}

export const delistUser = async (userId) => {
    // Удаление пользователя из команды "purple" и игры
    game.purple = game.purple.filter(item => item.userId !== userId);
    teams.purple = teams.purple.filter(item => item.userId !== userId);

    // Удаление пользователя из команды "white" и игры
    game.white = game.white.filter(item => item.userId !== userId);
    teams.white = teams.white.filter(item => item.userId !== userId);

    // Удаление пользователя из общего списка игроков игры
    game.players = game.players.filter(item => item.userId !== userId);
};

// Функция для получения информации о пользователе
export async function getUserInfo(userId) {
    try {
        const response = await vk.api.users.get({
            user_ids: userId,
            access_token: access_token,
            v: '5.131'
        });
        return response[0] || { firstName: '', lastName: '' };
    } catch (error) {
        console.error(error);
    }
}

export function isAdmin(userId) {
    return adminIds.includes(userId)
}

export const isUserAgreed = (userId) => {
    return usersAgreement.some(item => item.userId === userId && item.agreement);
};
export async function isUserSubscribed(userId) {
    try {
        const response = await vk.api.groups.isMember({
            group_id: groupId,
            access_token: access_token,
            user_id: userId
        });

        return response === 1;
    } catch (error) {
        console.error('Ошибка при проверке подписки:', error);
        return false;
    }
}