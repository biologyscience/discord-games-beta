const fetch = require('node-fetch');

const appID =
{
    "youtube" : "755600276941176913",
    "poker" : "755827207812677713",
    "betrayal" : "773336526917861400",
    "fishing" : "814288819477020702",
    "chess" : "832012774040141894",
    "lettertile" : "879863686565621790",
    "wordsnack" : "879863976006127627",
    "doodlecrew" : "878067389634314250",
    "awkword" : "879863881349087252",
    "spellcast" : "852509694341283871"
};

const appNames = ["youtube", "poker", "betrayal", "fishing", "chess", "lettertile", "wordsnack", "awkword", "doodlecrew", "spellcast"];

const Games = class DiscordGames
{
    constructor(Client, VoiceChannel, GameName = new String, MaxDuration = new Number)
    {
        this.Client = Client;
        this.VoiceChannel = VoiceChannel;
        this.GameName = GameName,
        this.MaxDuration = MaxDuration;
    };

    play()
    {
        return new Promise((result) =>
        {
            if (!this.Client) throw new Error('No client was provided !');

            if (!this.VoiceChannel) throw new Error('No Voice Channel was provided !');

            if (!appNames.some(x => x === this.GameName)) throw new Error('Invalid game name.\nGame name can only be any of the these\n' + appNames.join(', '));

            if (!this.MaxDuration) throw new Error('No time limit was given to the game event !');

            //

            const body_data = { max_age: this.MaxDuration, target_application_id: appID[this.GameName], target_type: 2, temporary: false };
    
            const body = JSON.stringify(body_data);
    
            const headers = { authorization: 'Bot ' + this.Client.token, 'content-type' : 'application/json' };
    
            const URL = `https://discord.com/api/v8/channels/${this.VoiceChannel.id}/invites`;

            //
    
            fetch.default(URL, { method: 'POST', body: body, headers: headers }).then(x => x.json()).then((data) =>
            {
                const finalResult =
                {
                    "code" : data.code,
                    "inviteLink" : `https://discord.com/invite/${data.code}`,
                    "createdAt" : new Date(data.created_at),
                    "validTill" : new Date(data.expires_at),

                    "guild" :
                    {
                        "id" : data.guild.id,
                        "name" : data.guild.name
                    },

                    "channel" :
                    {
                        "id" : data.channel.id,
                        "name" : data.channel.name
                    },

                    "inviter" : 
                    {
                        "id" : data.inviter.id,
                        "name" : data.inviter.username
                    },

                    "app" :
                    {
                        "id" : data.target_application.id,
                        "name" : data.target_application.name,
                        "description" : data.target_application.description,
                        "summary" : data.target_application.summary,
                        "maxMembers" : data.target_application.max_participants,
                    }
                };

                result(finalResult);
            });
        });
    };

    gameNames() { return appNames };
};

module.exports = Games;