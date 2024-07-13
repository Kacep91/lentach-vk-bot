import { Keyboard } from 'vk-io';
import { HearManager } from '@vk-io/hear';
import express from 'express';
import { randomInt } from 'crypto';
import bodyParser from 'body-parser';
import { delistUser, checkAndAddPlayersFromQueue, game, teams, saveWinnerTeam, handleJoinTeam, isUserSubscribed, isUserAgreed, isAdmin, getUserInfo, users, usersAgreement, vk, saveUsers, saveUserAgreement, saveGreetedUsers, greetedUsers } from './utils.js'

const app = express();
app.use(bodyParser.json());

const hearManager = new HearManager();

const keyboardAgreement = Keyboard.keyboard([
    Keyboard.textButton({
        label: '!ОК, согласен',
        color: Keyboard.PRIMARY_COLOR
    })
])

const keyboardSubscription = Keyboard.keyboard([
    Keyboard.textButton({
        label: '!Проверить подписку',
        color: Keyboard.SECONDARY_COLOR
    }),
    Keyboard.urlButton({
        label: '!Ссылка на сообщество',
        url: 'https://vk.com/club226526399',
        color: Keyboard.SECONDARY_COLOR
    })
])

const keyboardAgain = Keyboard.keyboard([
    Keyboard.textButton({
        label: '!ОК, согласен',
        color: Keyboard.PRIMARY_COLOR
    }),

    Keyboard.textButton({
        label: '!Проверить подписку',
        color: Keyboard.SECONDARY_COLOR
    })
])

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

const keyboardRegistration = Keyboard.keyboard([
    Keyboard.textButton({
        label: '!Регистрация на игру',
        color: Keyboard.POSITIVE_COLOR
    }),
    Keyboard.textButton({
        label: '!Правила игры',
        color: Keyboard.PRIMARY_COLOR
    }),
    Keyboard.urlButton({
        label: 'Правила проведения акции',
        url: "https://disk.yandex.ru/i/cfdQA9XSjrCCGA"
    })
])

hearManager.hear('Погнали', async (context) => {
    await context.send(`Если ты это читаешь, ты человек.\nВедь собаки, кошки, рыбки не умеют читать, а ты можешь всё — тусить на VK Fest и играть в Мемный петанк и многое другое.\nЗаписывайся на игру и вперёд, быстрее, выше сильнее и вот это всё.\n`, {
        keyboard: Keyboard.keyboard([
            Keyboard.textButton({
                label: '!ОК, согласен',
                color: Keyboard.PRIMARY_COLOR
            }),
            Keyboard.textButton({
                label: '!Я - рыбка',
                color: Keyboard.SECONDARY_COLOR
            }),
        ])
    })
});

hearManager.hear('!Заново', async (context) => {
    await context.send(`Если ты это читаешь, ты человек.\nВедь собаки, кошки, рыбки не умеют читать, а ты можешь всё — тусить на VK Fest и играть в Мемный петанк и многое другое.\nЗаписывайся на игру и вперёд, быстрее, выше сильнее и вот это всё.\n`, {
        keyboard: Keyboard.keyboard([
            Keyboard.textButton({
                label: '!ОК, согласен',
                color: Keyboard.PRIMARY_COLOR
            }),
            Keyboard.textButton({
                label: '!Я - рыбка',
                color: Keyboard.SECONDARY_COLOR
            }),
        ])
    })
});

// Добавьте эту функцию для проверки наличия хэштега в тексте
function hasHashtag(text, hashtag) {
    return text.toLowerCase().includes(hashtag.toLowerCase());
}

// Проверка хэштега в репостах
vk.updates.on('wall_repost', async (context) => {
    const { wall } = context;

    if (wall && wall.text && hasHashtag(wall.text, '#мемныйпетанк')) {
        try {
            await vk.api.messages.send({
                peer_id: context.senderId,
                message: 'Подойди к промоутеру, получи свой стикер пак!',
                random_id: randomInt(1000000)
            });
            console.log(`Отправлено сообщение пользователю ${context.senderId}`);
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
        }
    }
});

// vk.updates.on('message_new', async (context) => {
//     // Убираем проверку на чат, чтобы обрабатывать все сообщения
//     const userId = context.senderId;

//     if (isAdmin(userId)) {
//         await hearManager.middleware(context);
//         return;
//         // Проверяем, было ли уже отправлено приветствие этому пользователю
//     } else if (!greetedUsers.find(item => item === userId)) {
//         // Отправляем приветственное сообщение
//         await context.send(`Если ты это читаешь, ты человек.\nВедь собаки, кошки, рыбки не умеют читать, а ты можешь всё — тусить на VK Fest и играть в петанк Лентача-Мемный петанк и многое другое.\nЗаписывайся на игру и вперёд, быстрее, выше сильнее и вот это всё.\n`, {
//             keyboard: Keyboard.keyboard([
//                 Keyboard.textButton({
//                     label: '!ОК, согласен',
//                     color: Keyboard.PRIMARY_COLOR
//                 }),
//                 Keyboard.textButton({
//                     label: '!Я не на VK Fest',
//                     color: Keyboard.SECONDARY_COLOR
//                 }),
//             ])
//         });

//         // Добавляем пользователя в список поприветствованных
//         greetedUsers.push(userId);
//         await saveGreetedUsers()
//     }

//     // Добавляем обработку команд через hearManager
//     await hearManager.middleware(context);
// });

// hearManager.hear('!Я не на VK Fest', async (context) => {
//     await context.send(`Если ты не на VK Fest… окажись там виртуально!\nИ краткий обзор бренд-зоны Lentach на VK Fest.\n`, {
//         keyboard: Keyboard.keyboard([
//             Keyboard.urlButton({
//                 label: '!Ссылка на сообщество',
//                 url: 'https://vk.com/club226526399',
//                 color: Keyboard.SECONDARY_COLOR
//             }),
//             Keyboard.urlButton({
//                 label: 'Подписаться на Телеграм',
//                 url: 'https://t.me/oldlentach'
//             }),
//             Keyboard.textButton({
//                 label: '!Заново',
//                 color: Keyboard.PRIMARY_COLOR
//             }),
//         ])
//     })
// });

hearManager.hear('!Я - рыбка', async (context) => {
    try {
        await context.send({
            message: `Если ты рыбка, тогда держи мем:\n`,
            attachment: 'photo-29534144_459073138,photo-29534144_459073134,photo-29534144_459073135,photo-29534144_459073136,photo-29534144_459073137', // Замените на ID вашей фотографии
            keyboard: Keyboard.keyboard([
                Keyboard.urlButton({
                    label: '!Ссылка на сообщество',
                    url: 'https://vk.com/lentach',
                    color: Keyboard.SECONDARY_COLOR
                }),
                Keyboard.urlButton({
                    label: 'Подписаться на Телеграм',
                    url: 'https://t.me/oldlentach'
                }),
                Keyboard.textButton({
                    label: '!Заново',
                    color: Keyboard.SECONDARY_COLOR
                }),
            ])
        }
        )
    } catch (error) {
        console.log(error)
    }
});

hearManager.hear('!ОК, согласен', async (context) => {
    const userId = context.senderId;
    const userIndex = users.findIndex(item => item.userId === userId);
    if (users[userIndex]) {
        await context.send('Можете регистрироваться на игру! :)', {
            keyboard: keyboardRegistration
        });
    } else {
        const userInfo = await getUserInfo(userId);
        users.push({
            date: context.message.date,
            userId,
            firstName: userInfo.first_name,
            lastName: userInfo?.last_name
        });
        await saveUsers();

        await context.send('Можете регистрироваться на игру! :)', {
            keyboard: keyboardRegistration
        });
    }
});

// hearManager.hear('!Принять', async (context) => {
//     const userId = context.senderId;
//     const userAgreed = isUserAgreed(userId);
//     const proceedToSubscription = !userAgreed
//     const isUserDeclinedBefore = usersAgreement.some(item => item.userId === userId)
//     const userIndex = usersAgreement.findIndex(item => item.userId === userId);

//     if (proceedToSubscription) {
//         const userInfo = await getUserInfo(userId);
//         if (isUserDeclinedBefore) {
//             usersAgreement[userIndex] = {
//                 date: context.message.date,
//                 userId,
//                 firstName: userInfo.first_name,
//                 lastName: userInfo?.last_name,
//                 agreement: true
//             }
//         } else {
//             usersAgreement.push({
//                 date: context.message.date,
//                 userId,
//                 firstName: userInfo.first_name,
//                 lastName: userInfo?.last_name,
//                 agreement: true
//             })
//         }

//         users.push({
//             date: context.message.date,
//             userId,
//             firstName: userInfo.first_name,
//             lastName: userInfo?.last_name
//         });

//         await context.send('Спасибо за согласие! Теперь подпишитесь на сообщество.', {
//             keyboard: keyboardSubscription
//         });
//         await saveUsers();
//         await saveUserAgreement();
//     }
// });

// hearManager.hear('!Отклонить', async (context) => {
//     const userId = context.senderId;
//     usersAgreement.push({ userId, agreement: false });
//     await context.send('Вы отклонили согласие. Вы не можете использовать бота.', {
//         keyboard: Keyboard.keyboard([
//             Keyboard.textButton({
//                 label: '!ОК, согласен',
//                 color: Keyboard.SECONDARY_COLOR
//             })
//         ])
//     });
//     await saveUserAgreement();
// });

// hearManager.hear('!Подробнее', async (context) => {
//     const userId = context.senderId;
//     const isSubscriptionTrue = isUserSubscribed(userId);
//     const isAlreadyAgreed = isUserAgreed(userId);
//     if (isAlreadyAgreed && isSubscriptionTrue) {
//         await context.send('Кажется, мы вас уже знаем... Можете регистрироваться на игру! :)', {
//             keyboard: keyboardRegistration
//         });
//     } else if (!isAlreadyAgreed) {
//         await context.send(`на следующих условиях:\n
//             1. Перечень персональных данных, на обработку которых дается согласие:\n
//             • имя и фамилия, указанные в профиле ВКонтакте;\n
//             • идентификатор пользователя ВКонтакте;\n
//             • фотография профиля;\n
//             • адрес электронной почты (если указан в профиле);\n
//             • номер телефона (если указан в профиле);\n
//             • другие данные, добровольно предоставленные мной в ходе взаимодействия с чат-ботом.\n
//             2. Цель обработки персональных данных:\n
//             • предоставление услуг/информации через чат-бота в сообществе Lentach; \n
//             • улучшение качества обслуживания;\n
//             • информирование о новых услугах/продуктах;\n
//             • проведение маркетинговых и статистических исследований.\n
//             3. Перечень действий с персональными данными:\n
//             Оператор вправе осуществлять любые действия (операции) с моими персональными данными, включая сбор, запись, систематизацию, накопление, хранение, уточнение, извлечение, использование, передачу, обезличивание, блокирование, удаление, уничтожение.\n
//             4. Я даю согласие на использование моих фото- и видеоизображений, а также иных материалов с моим участием, в рекламных, информационных и иных материалах, размещаемых в сети интернет, в том числе на сайте Оператора и в сообществе Оператора в социальной сети ВКонтакте.\n
//             5. Настоящее согласие действует со дня его предоставления до дня отзыва в письменной форме.\n
//             6. Я оставляю за собой право отозвать свое согласие посредством составления соответствующего письменного документа, который может быть направлен мной в адрес Оператора по электронной почте или через форму обратной связи на сайте Оператора.\n
//             Нажимая кнопку "Согласен" или продолжая взаимодействие с чат-ботом, я подтверждаю, что я ознакомлен с вышеуказанным согласием, полностью его понимаю и принимаю все его условия.\n`, {
//             keyboard: Keyboard.keyboard([
//                 Keyboard.textButton({
//                     label: '!Принять',
//                     color: Keyboard.POSITIVE_COLOR
//                 }),
//                 Keyboard.textButton({
//                     label: '!Отклонить',
//                     color: Keyboard.NEGATIVE_COLOR
//                 })
//             ])
//         })
//     } else if (isAlreadyAgreed && !isSubscriptionTrue) {
//         await context.send('Согласие у нас есть, а вот подписки что-то невидно! Подпишитесь на сообщество.', {
//             keyboard: keyboardSubscription
//         });
//     }
// });

// hearManager.hear('!Проверить подписку', async (context) => {
//     const userId = context.senderId;
//     const isSubscriptionTrue = await isUserSubscribed(userId);
//     const userAgreement = isUserAgreed(userId);

//     if (userAgreement && !isSubscriptionTrue) {
//         try {
//             context.send('Вам необходимо подписаться на сообщество!', {
//                 keyboard: keyboardSubscription
//             });
//         } catch (error) {
//             console.error('Ошибка при подписке:', error);
//             await context.send('Произошла ошибка при подписке. Пожалуйста, попробуйте позже.', {
//                 keyboard: Keyboard.builder()
//             });
//         }
//     } else {
//         await context.send('Вы уже подписаны на сообщество!', {
//             keyboard: keyboardRegistration
//         });
//     }
// });

hearManager.hear('!Регистрация на игру', async (context) => {
    console.log('game', game);
    console.log('teams', teams);
    // if (userAgreement && isSubscriptionTrue) {
    context.send(`Ожидайте, идёт регистрация на игру...`, { keyboard: Keyboard.builder() });
    await handleJoinTeam(context)
    // } else {
    //     await context.send(`Ваше ${!isUserAgreed(userId) ? 'согласие не найдено' : !isSubscriptionTrue ? 'подписка не найдена' : "согласие или подписка не найдены"}. Вы не можете использовать бота. Попробуйте еще раз.`, { keyboard: !isUserAgreed(userId) ? keyboardAgreement : !isSubscriptionTrue ? keyboardSubscription : keyboardAgain });
    // }
});

hearManager.hear('!Правила игры', async (context) => {
    const userId = context.senderId;
    const isUserRegistered = teams?.purple.find(item => item?.userId === userId) || teams?.white?.find(item => item?.userId === userId)
    await context.send(`Правила игры:\n

Петанк — это вид спорта, в котором:\n

– 3 игрока играют против 3 игроков. Если вас по двое, тоже welcome!\n

– Каждый игрок имеет по 2 шара.\n

– Игроки должны провести жеребьевку, чтобы определить — какая из двух команд выберет дорожку, если она не была назначена организаторами, и первой бросит кошонет.\n

– Команда, начинающая игру, чертит на земле круг диаметром 30-50 см или использует круг-шаблон.\n

– Игрок первой команды бросает деревянный шарик (кошонет) на расстояние от 6 до 10 метров, но не ближе чем на 50 см от любого препятствия.\n

– Ноги игрока должны оставаться внутри круга до тех пор, пока кошонет не остановится.\n

– После броска кошонета любой игрок первой команды бросает первый металлический шар, стараясь разместить его как можно ближе к кошонету.\n

– Затем игроки второй команды пытаются бросить свои шары ближе к кошонету или выбить шары соперника.\n

– Игроки команд поочередно бросают шары, пока у одной из команд не закончатся все шары.\n

– После того как все шары брошены, подсчитываются очки.\n

– Команда получает одно очко за каждый шар, который находится ближе к кошонету, чем ближайший шар соперника.\n

– Игра продолжается до тех пор, пока одна из команд не наберет 13 очков\n`, { keyboard: isUserRegistered ? keyboardCancelRegistration : keyboardRegistration });
});

hearManager.hear('!Отменить регистрацию на игру', async (context) => {
    const userId = context.senderId;
    const isUserRegistered = teams?.purple.find(item => item?.userId === userId) || teams?.white?.find(item => item?.userId === userId)
    console.log('game', game);
    console.log('teams', teams);

    if (isUserRegistered) {
        const keyboard = Keyboard.keyboard([
            Keyboard.textButton({
                label: '!Да, отменяем',
                color: Keyboard.POSITIVE_COLOR
            }),
            Keyboard.textButton({
                label: '!Нет, не надо',
                color: Keyboard.NEGATIVE_COLOR
            })
        ]);
        await context.send(`Вы уверены, что хотите отменить вашу регистрацию на игру?`, { keyboard: keyboard });
    } else {
        await context.send(`Вы еще не зарегистрированы на игру! Может, попробуем?`, {
            keyboard: keyboardRegistration
        });
    }
});

console.log('game', game);
console.log('teams', teams);
hearManager.hear('!Да, отменяем', async (context) => {
    const userId = context.senderId;
    const isUserRegistered = teams?.purple.find(item => item?.userId === userId) || teams?.white?.find(item => item?.userId === userId)

    if (isUserRegistered) {
        await delistUser(userId);
        await context.send(`Вы успешно отменили вашу регистрацию на игру!`, {
            keyboard: keyboardRegistration
        });
    }
});

hearManager.hear('!Нет, не надо', async (context) => {
    const userId = context.senderId;
    // const isSubscriptionTrue = await isUserSubscribed(userId);
    // const userAgreement = isUserAgreed(userId);
    const isUserRegistered = teams?.purple.find(item => item?.userId === userId) || teams?.white?.find(item => item?.userId === userId)

    if (isUserRegistered) {
        await context.send('Ничего не отменилось!', { keyboard: keyboardCancelRegistration });
    }
});

hearManager.hear('!Старт игры', async (context) => {
    const userId = context.senderId;

    if (isAdmin(userId)) {
        const allPlayersOfCurrentGame = game?.players
        for (const player of allPlayersOfCurrentGame) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Задержка в 0,5 секунд           
            await vk.api.messages.send({
                user_id: player?.userId,
                random_id: randomInt(1000000),
                message: `Игра начинается! Проходи к полю.\nИ не забывай постить свои шары (петанковые) с прикольными подписями и хэштэгом #мемныйпетанк у себя в VK.\nЗа крутые публикации подарим стикер пак.\n`,
                keyboard: Keyboard.builder().
                    textButton({
                        label: '!Правила игры',
                        color: Keyboard.PRIMARY_COLOR
                    })
            });
        }

        await context.send('Игра началась! После окончания игры, выберите победителя:', {
            keyboard: Keyboard.builder()
                .textButton({ label: '!Победитель - Фиолетовые' })
                .textButton({ label: '!Победитель - Белые' })
                .textButton({ label: '!Сброс игры' })
        });
    } else {
        await context.send('У вас нет прав для выполнения этой команды.');
    }
});

hearManager.hear('!Сброс игры', async (context) => {
    const userId = context.senderId;

    if (isAdmin(userId)) {
        await context.send('Вы уверены, что хотите сбросить текущую игру?', {
            keyboard: Keyboard.builder()
                .textButton({ label: '!Да, сбросить игру' })
                .textButton({ label: '!Нет, не сбрасывать' })
        });
    } else {
        await context.send('У вас нет прав для выполнения этой команды.');
    }
});

hearManager.hear('!Отмена игры', async (context) => {
    const userId = context.senderId;

    if (isAdmin(userId)) {
        await context.send('Вы уверены, что хотите отменить текущую игру?', {
            keyboard: Keyboard.builder()
                .textButton({ label: '!Да, отменить игру' })
                .textButton({ label: '!Нет, не отменять' })
        });
    } else {
        await context.send('У вас нет прав для выполнения этой команды.');
    }
});

hearManager.hear('!Да, отменить игру', async (context) => {
    const userId = context.senderId;

    if (isAdmin(userId)) {
        const allPlayersOfCurrentGame = game?.players
        try {
            for (const player of allPlayersOfCurrentGame) {
                await new Promise(resolve => setTimeout(resolve, 500)); // Задержка в 0,5 секунд
                await clearGame()
                await vk.api.messages.send({
                    user_id: player?.userId,
                    random_id: randomInt(1000000),
                    message: `Игра отменена, пожалуйста, зарегистрируйтесь заново\n`,
                    keyboard: Keyboard.builder()
                        .textButton({ label: '!Регистрация на игру' })
                        .textButton({ label: '!Правила игры' })
                });
            }
        } catch (error) {
            console.error('Ошибка при отмене всех записей в боте', error)
        }

        await context.send('Игра отменена! Ожидаем начала новой игры...', {
            keyboard: Keyboard.builder()
        });
        await checkAndAddPlayersFromQueue()
    } else {
        await context.send('У вас нет прав для выполнения этой команды.');
    }
});

hearManager.hear('!Нет, не отменять', async (context) => {
    const userId = context.senderId;

    if (isAdmin(userId)) {
        await context.send('Игра готова к началу! После окончания игры, выберите победителя:', {
            keyboard: Keyboard.builder()
                .textButton({ label: '!Старт игры' })
                .textButton({ label: '!Отмена игры' })
        });
    } else {
        await context.send('У вас нет прав для выполнения этой команды.');
    }
});

hearManager.hear('!Да, сбросить игру', async (context) => {
    const userId = context.senderId;

    if (isAdmin(userId)) {
        const allPlayersOfCurrentGame = game?.players
        for (const player of allPlayersOfCurrentGame) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Задержка в 0,5 секунд
            await clearGame()
            await vk.api.messages.send({
                user_id: String(player).length > 1 ? player?.userId : 5720735,
                random_id: randomInt(1000000),
                message: `Игра сброшена, пожалуйста, зарегистрируйтесь заново\n`,
                keyboard: Keyboard.builder()
                    .textButton({ label: '!Регистрация на игру' })
                    .textButton({ label: '!Правила игры' })
            });
        }

        await context.send('Игра сброшена! Ожидаем начала новой игры...', {
            keyboard: Keyboard.builder()
        });
        await checkAndAddPlayersFromQueue()
    } else {
        await context.send('У вас нет прав для выполнения этой команды.');
    }
});

hearManager.hear('!Нет, не сбрасывать', async (context) => {
    const userId = context.senderId;

    if (isAdmin(userId)) {
        await context.send('Игра продолжается! После окончания игры, выберите победителя:', {
            keyboard: Keyboard.builder()
                .textButton({ label: '!Победитель - Фиолетовые' })
                .textButton({ label: '!Победитель - Белые' })
                .textButton({ label: '!Сброс игры' })
        });
    } else {
        await context.send('У вас нет прав для выполнения этой команды.');
    }
});

hearManager.hear('!Победитель - Фиолетовые', async (context) => {
    const userId = context.senderId;

    if (isAdmin(userId)) {
        await context.send(`Вы уверены? Продолжить с "Победила Фиолетовая команда"?`, {
            keyboard: Keyboard.builder()
                .textButton({ label: '!Да, победила Фиолетовая' })
                .textButton({ label: '!Нет, победитель неопределен' })
        });
    } else {
        await context.send('У вас нет прав для выполнения этой команды.');
    }
});

hearManager.hear('!Да, победила Фиолетовая', async (context) => {
    const userId = context.senderId;
    if (isAdmin(userId)) {
        saveWinnerTeam('purple')
        await context.send(`Победила Фиолетовая команда!`, { keyboard: Keyboard.builder() });
    } else {
        await context.send('У вас нет прав для выполнения этой команды.');
    }
});
hearManager.hear('!Победитель - Белые', async (context) => {
    const userId = context.senderId;

    if (isAdmin(userId)) {
        await context.send(`Вы уверены? Продолжить с "Победила Белая команда"?`, {
            keyboard: Keyboard.builder()
                .textButton({ label: '!Да, победила Белая' })
                .textButton({ label: '!Нет, победитель неопределен' })
        });
    } else {
        await context.send('У вас нет прав для выполнения этой команды.');
    }
});

hearManager.hear('!Да, победила Белая', async (context) => {
    const userId = context.senderId;
    if (isAdmin(userId)) {
        saveWinnerTeam('white')
        await context.send(`Победила Белая команда!`, { keyboard: Keyboard.builder() });
    } else {
        await context.send('У вас нет прав для выполнения этой команды.');
    }
});

hearManager.hear('!Нет, победитель неопределен', async (context) => {
    const userId = context.senderId;
    if (isAdmin(userId)) {
        await context.send('Выберите победителя:', {
            keyboard: Keyboard.builder()
                .textButton({ label: '!Победитель - Фиолетовые' })
                .textButton({ label: '!Победитель - Белые' })
        });
    } else {
        await context.send('У вас нет прав для выполнения этой команды.');
    }
});

vk.updates.startPolling()
    .then(() => {
        console.log('Бот запущен и работает через Long Poll API');
    })
    .catch(console.error);

vk.updates.use(hearManager.middleware);
