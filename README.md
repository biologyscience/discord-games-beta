# Discord Games BETA
## 30 mins left to publish on [npm](https://www.npmjs.com/)

<br>

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

client.on('message', (message) => // replace ('message', with ('messageCreate', if you are on discord.js v13
{
    if (message.content === 'play')
    {
        if (!reaction.users.cache.has(message.author.id)) return;
        
        const VoiceChannel = message.member.voice.channel;  // The voice channel in which the event is gonna occur
        
        const GameName = 'youtube';  // Name of the game

        const MaxDuration = 3600;    // 1 Hour in seconds

        const YouTube = new DiscordGame(client, VoiceChannel, GameName, MaxDuration);

        YouTube.play().then(result => message.channel.send(result.inviteLink));
    }
});

client.login('YourBotTokenHere');
```
## What should I do if I want to play other games ?
### Just replace **youtube** which is beside `const GameName` with any of the available games

To get the list of the available games you can do
```js
const DiscordGame = require('discord-games-beta');
const game = new DiscordGame();

console.log(game.gameNames()); // This will print all the available games in your console !
```

<br>

# Example code (for more than one games)

```js
const Discord = require('discord.js');
const DiscordGame = require('discord-games-beta');

const client = new Discord.Client();

client.on('message', (message) => // replace ('message', with ('messageCreate', if you are on discord.js v13
{
    if (message.content === 'play')
    {
        const map = new Map();

        map.set('🇦', 'youtube');
        map.set('🇧', 'chess');
        map.set('🇨', 'lettertile');
        map.set('🇩', 'wordsnack');
        map.set('🇪', 'doodlecrew');

        const Message = [];

        [...map.entries()].forEach(x => Message.push(`React with ${x[0]} to play ${x[1]}`));

        message.channel.send(Message).then((msg) =>
        {
            [...map.entries()].forEach(x => msg.react(x[0]));

            const filter = (reaction) => reaction; // remove this line if you are on discord.js v13
            const collector = new Discord.ReactionCollector(message, filter); // remove ", filter" if you are on discord.js v13
    
            collector.on('collect', (reaction) =>
            {
                if (!reaction.users.cache.has(message.author.id)) return;

                collector.stop();

                const VoiceChannel = message.member.voice.channel;  // The voice channel in which the event is gonna occur

                const GameName = map.get(reaction.emoji.name);

                const MaxDuration = 3600;    // 1 Hour in seconds

                const game = new DiscordGame(client, VoiceChannel, GameName, MaxDuration);

                game.play().then(result => message.channel.send(result.inviiteLink));
            });
        });
    }
});

client.login('YourBotTokenHere');
```

<br>

## Have Fun 🥳

<br>

Side Note:
- I am **not** related to [Discord](https://discord.com) in any means, I am just a normal guy wanted to make a npm package.
- This package will **not** be maintained, this is only used to test with my friends. If you have any questions, you may add me in **Discord**: [BIOLOGY SCIENCE#3709](https://discordapp.com/users/580322451729154049)
