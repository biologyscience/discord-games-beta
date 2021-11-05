# Discord Games BETA
### **NOTE**:
This is my first npm package, used for testing with others. Feel free to continue reading if you want to use it for yourself.

<br>

# What is this ?
This is a package used to enable an game event inside a **Discord Voice Channel**, like **YouTube Watch Togther**, **Chess**, **Word Tile**, and much more.

# Installation
```js
npm i discord-games-beta
```
# 

# Example Code (for one game)

This is how you can implement the feature in your code !

```js
const Discord = require('discord.js');
const DiscordGame = require('discord-games-beta');

const client = new Discord.Client();
const YouTube = new DiscordGame(client, 'youtube', 3600);

// 'youtube' is the name of the game
// 3600 is the time in seconds after which the link gets expired. The time can only be more than 0

client.on('message', (message) => // replace ('message', with ('messageCreate', if you are on discord.js v13
{
    if (message.content === 'play')
    {    
        const VoiceChannel = message.member.voice.channel;  // The voice channel in which the event is gonna occur

        YouTube.play(VoiceChannel).then(result => message.channel.send(result.inviteLink));
    }
});

client.login('YourBotTokenHere');
```
![Example Code (for one game)](https://raw.githubusercontent.com/BIOLOGY-SCIENCE/discord-games-beta/main/assets/one%20game.png)

## What should I do if I want to play other games ?
### Just replace **'youtube'** which is in the second parameter of `new DiscordGame()` with any of the available games

To get the list of the **available games** you can do
```js
const DiscordGame = require('discord-games-beta');
const game = new DiscordGame();

console.log(game.gameNames); // This will print all the available games in your console !
```
### Output:
```js
["youtube", "poker", "betrayal", "fishing", "chess", "lettertile", "wordsnack", "awkword", "doodlecrew", "spellcast", "checkers"]
```

<br>

# Example code (for more than one games)

```js
const Discord = require('discord.js');
const DiscordGame = require('discord-games-beta');

const client = new Discord.Client();

const YouTube = new DiscordGame(client, 'youtube', 3600);
const Chess = new DiscordGame(client, 'chess', 3600);
const LetterTile = new DiscordGame(client, 'lettertile', 3600);
const WordSnack = new DiscordGame(client, 'wordsnack', 3600);
const DoodleCrew = new DiscordGame(client, 'doodlecrew', 3600);

client.on('message', (message) => // replace ('message', with ('messageCreate', if you are on discord.js v13
{
    if (message.content === 'play')
    {
        const games =
        [
            "🇦 - YouTube Watch Together",
            "🇧 - Chess",
            "🇨 - Letter Tile",
            "🇩 - Word Snack",
            "🇪 - Doodle Crew"
        ];

        const ReactionEmbed = new Discord.MessageEmbed()
        .setColor('#2F3136')
        .setDescription(`React to the appropriate emoji to start a game !\n\n${games.join('\n')}`);

        message.channel.send(ReactionEmbed).then((msg) => // change 'ReactionEmbed' to '{embeds: [ReactionEmbed]}' if you are on discord.js v13
        {
            msg.react('🇦');
            msg.react('🇧');
            msg.react('🇨');
            msg.react('🇩');
            msg.react('🇪');

            const filter = (reaction) => reaction; // remove this line if you are on discord.js v13
            const collector = new Discord.ReactionCollector(msg, filter); // remove ", filter" if you are on discord.js v13
    
            collector.on('collect', (reaction) =>
            {
                if (!reaction.users.cache.has(message.author.id)) return;

                collector.stop();

                const VoiceChannel = message.member.voice.channel;  // The voice channel in which the event is gonna occur

                if (reaction.emoji.name === '🇦') return YouTube.play(VoiceChannel).then(result => message.channel.send(result.inviteLink));

                if (reaction.emoji.name === '🇧') return Chess.play(VoiceChannel).then(result => message.channel.send(result.inviteLink));

                if (reaction.emoji.name === '🇨') return LetterTile.play(VoiceChannel).then(result => message.channel.send(result.inviteLink));

                if (reaction.emoji.name === '🇩') return WordSnack.play(VoiceChannel).then(result => message.channel.send(result.inviteLink));

                if (reaction.emoji.name === '🇪') return DoodleCrew.play(VoiceChannel).then(result => message.channel.send(result.inviteLink));
            });
        });
    }
});

client.login('YourBotTokenHere');
```

![Example code (for more than one games)](https://raw.githubusercontent.com/BIOLOGY-SCIENCE/discord-games-beta/main/assets/more%20than%20one%20game.png)

<br>

> **Pro Tip**: To make the invite link work forever, you can just replace the number `3600` to **`true`**

## Have Fun 🥳

<br>

Side Note:
- I am **not** related to [Discord](https://discord.com) in any means, I am just a normal guy wanted to make a npm package.
- This package will **not** be maintained, this is only used to test with my friends. If you have any questions, you may add me in **Discord**: [BIOLOGY SCIENCE#3709](https://discordapp.com/users/580322451729154049)