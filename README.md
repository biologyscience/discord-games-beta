# Discord Games BETA
### **NOTE**:
This is my first npm package, used for testing with my friends. Feel free to continue reading if you want to use it for yourself.

<br>

If you have any errors or issues, please update the package by doing `npm i discord-games-beta` and read the contents in the usage section to make sure you have coded it correctly  
If that doesn't solve your error, have a look at the [Known Issues](#known-issue) section.

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
/**
 * (YourDiscordBotToken, NameOfTheGame, MaximumDuration, {Options})
 */

const game = new DiscordGame('Token', 'chess', 2, {neverExpire: false});

/**
 * "Token" is the Discord Client which you are using in your code
 * "chess" is the name of the game which you wanted to play
 * "2" is the Maximum Duration of the game event in hours
 * 
 * "neverExpire" is an optional parameter by which you can choose wheater you want your invite link to get expired or not
 * Normally it will get expired after the "MaximumDuration" but by setting the parameter to true, the link will not expire on its own
 */
```
### NOTE: The Maximum Duration can only be more than 0

<br>

- Function: 
```js
game.play(vc).then(result => console.log(result));

// "vc" is the Discord Voice channel which you want to play the game in.
```
- Result:
```js
{
    code : String // Code of the invite link
    inviteLink : String // The invite link itself
    createdAt : Date // The time when the invite was created
    validTill : Date | String // The time at which the invite gets expired, if 'neverExpire' is set as 'true' you will get a string

    guild :
    {
        ID : String // ID of the server in which the invite has been made
        name : String // Name of the server in which the invite has been made
    },

    channel :
    {
        ID : String // ID of the channel to which the invite has been made
        name : String // Name of the channel to which the invite has been made
    },

    inviter : 
    {
        ID : String // ID of the user who made the invite (i.e, The Bot's ID which has been used to do the task)
        name : String // Name of the user who made the invite (i.e, The Bot's Name which has been used to do the task)
    },

    app :
    {
        ID : String // ID of the game
        name : String // Name of the game
        description : String // A short description of the game
        summary : String // A summary of the game
        maxMembers : String // Maximum number of members the game allows
    }
}
```


# Example Code (for one game)

```js
const Discord = require('discord.js');
const DiscordGame = require('discord-games-beta');

const client = new Discord.Client();
const YouTube = new DiscordGame('Token', 'youtube', 2);

client.on('messageCreate', (message) =>
{
    if (message.content === 'play')
    {    
        const VoiceChannel = message.member.voice.channel;  // The voice channel in which the event is gonna occur

        YouTube.play(VoiceChannel).then(result => message.channel.send(result.inviteLink));
    }
});

client.login('Token');
```
![Example Code (for one game)](https://raw.githubusercontent.com/biologyscience/discord-games-beta/main/assets/one%20game.png)

## What should I do if I want to play other games ?
Just replace **name of the game** which is the second parameter of constructor (i.e, `new DiscordGame()`) with any of the available games

To get the list of the **available games** you can do
```js
const DiscordGame = require('discord-games-beta');
const game = new DiscordGame();

console.log(game.gameNames()); // This will print all the available games in your console !
```
### Output:
```
youtube
poker
betrayal
fishing
chess
letterLeague
wordSnack
awkword
doodleCrew
spellCast
checkers
sketchHeads
blazing8s
landIO
puttParty
bobbleLeague
askAway
kwim    // Game name for "Know What I Meme"
```

<br>

# Example code (for more than one games)

```js
const Discord = require('discord.js');
const DiscordGame = require('discord-games-beta');

const client = new Discord.Client();

const YouTube = new DiscordGame('Token', 'youtube', 10);
const Chess = new DiscordGame('Token', 'chess', 1);
const LetterTile = new DiscordGame('Token', 'lettertile', 5);
const WordSnack = new DiscordGame('Token', 'wordsnack', 3);
const DoodleCrew = new DiscordGame('Token', 'doodlecrew', 2);

client.on('messageCreate', (message) =>
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

        message.channel.send({embeds: [ReactionEmbed]}).then((msg) =>
        {
            msg.react('🇦');
            msg.react('🇧');
            msg.react('🇨');
            msg.react('🇩');
            msg.react('🇪');

            const collector = new Discord.ReactionCollector(msg);
    
            collector.on('collect', (reaction) =>
            {
                collector.stop();

                const VoiceChannel = message.member.voice.channel;  // The voice channel in which the event is gonna occur

                const data =
                {
                    "🇦" : YouTube,
                    "🇧" : Chess,
                    "🇨" : LetterTile,
                    "🇩" : WordSnack,
                    "🇪" : DoodleCrew
                };

                data[reaction.emoji.name].play(VoiceChannel).then((result) => message.channel.send(result.inviteLink));
            });
        });
    }
});

client.login('Token');
```

![Example code (for more than one games)](https://raw.githubusercontent.com/biologyscience/discord-games-beta/main/assets/more%20than%20one%20game.png)

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

If you face any other issue, feel free to create an issue on the [issues page](https://github.com/biologyscience/discord-games-beta/issues) in the github repository

# 

## Have Fun 🥳

<br>

## F.A.Q:
### Do you work for Discord ?
**No**, I do not work for or related to [Discord](https://discord.com) in any means, I am just a normal person who uses it.
### Did you make this package ?
**Yes**, I am only person who made this package.
### Did you make these games ?
**No**, I did not make these games. All these games were made by a group of people in [Discord Games Lab](https://discord.gg/discordgameslab).

# 

**Do not** expect frequent changes to this package (unless there is a new game release or changes in a game) as this package is only used to test with my friends, but it works fine with everyone.  
If you have any questions, you may add me in **Discord**: [BIOLOGY SCIENCE#1756](https://discordapp.com/users/580322451729154049)  