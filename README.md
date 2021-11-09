# Discord Games BETA
### **NOTE**:
This is my first npm package, used for testing with my friends. Feel free to continue reading if you want to use it for yourself.

<br>

# What is this ?
This is a package used to enable an game event inside a **Discord Voice Channel**, like **YouTube Watch Togther**, **Chess**, **Word Tile**, and much more.

# How does this work ?
This works by creating an invite to a voice channel of your will in such a way that is makes game playable in that specific voice channel.

# Installation
```
npm i discord-games-beta
```

# Usage

- Constructor:
```js
const DiscordGame = require('discord-games-beta');

const game = new DiscordGame(params);
```
- Params:
```js
/*
const game = new DiscordGame(YourDiscordClient, NameOfTheGame, MaximumDuration)
*/

const game = new DiscordGame(client, 'chess', 3600);

// "client" is the Discord Client which you are using in your code
// "chess" is the name of the game which you wanted to play
// "3600" is the Maximum Duration of the game event in seconds (3600 is 1 Hour in Seconds)
```
### NOTE: The Maximum Duration can only be more than 0

<br>

- Function: 
```js
game.play(vc).then(result => console.log(result));

// "vc" is a Discord Voice channel which you want to play the game in.
```
- Result:
```js
{
    "code" : new String // Code of the invite link
    "inviteLink" : new String // The invite link itself
    "createdAt" : new Date() // The time when the invite was created
    "validTill" : new Date() // The time at which the invite gets expired

    "guild" :
    {
        "id" : new Number // ID of the server in which the invite has been made
        "name" : new String // Name of the server in which the invite has been made
    },

    "channel" :
    {
        "id" : new Number // ID of the channel to which the invite has been made
        "name" : new String // Name of the channel to which the invite has been made
    },

    "inviter" : 
    {
        "id" : new Number // ID of the user who made the invite (i.e, The Bot's ID which has been used to do the task)
        "name" : new String // Name of the user who made the invite (i.e, The Bot's Name which has been used to do the task)
    },

    "app" :
    {
        "id" : new Number // ID of the game
        "name" : new String // Name of the game
        "description" : new String // A short description of the game
        "summary" : new String // A summary of the game
        "maxMembers" : new String // Maximum number of members the game allows
    }
}
```


# Example Code (for one game)

```js
const Discord = require('discord.js');
const DiscordGame = require('discord-games-beta');

const client = new Discord.Client();
const YouTube = new DiscordGame(client, 'youtube', 3600);

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
Just replace **name of the game** which is the second parameter of constructor (i.e, `new DiscorGame()`) with any of the available games

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

<br>

## Known Issue:

### Most common error. Caused due to version mismatch of [node-fetch](https://www.npmjs.com/package/node-fetch)  

Error:
```
\node_modules\discord-games-beta\index.js:1
const fetch = require('node-fetch');
              ^

Error [ERR_REQUIRE_ESM]: require() of ES Module ... 
```
Fix:
- Open up your terminal
- Do `npm rm node-fecth` 
- Then do `npm i node-fetch@2.x`

<br>

If you face any other issue, feel free to create an issue on the [issues page](https://github.com/BIOLOGY-SCIENCE/discord-games-beta/issues) in the github repository

# 

## Have Fun 🥳

<br>

## F.A.Q:
### Do you work for Discord ?
**No**, I do not work for or related to [Discord](https://discord.com) in any means, I am just a normal person who uses it.
### Did you make this package ?
**Yes**, I am only person who made this package.
### Did you make these games ?
**No**, I did not make these games. All these games were done by a group of people in [Discord Games Lab](https://discord.gg/discordgameslab).

# 

**Do not** expect frequent changes to this package as this package is only used to test with my friends, but it works fine with everyone.  
If you have any questions, you may add me in **Discord**: [BIOLOGY SCIENCE#3709](https://discordapp.com/users/580322451729154049)