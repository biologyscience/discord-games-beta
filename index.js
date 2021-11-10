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
    "spellcast" : "852509694341283871",
    "checkers" : "832013003968348200"
};

const appNames = ["youtube", "poker", "betrayal", "fishing", "chess", "lettertile", "wordsnack", "awkword", "doodlecrew", "spellcast", "checkers"];

class DiscordGames
{

   /**
    * @param {Discord.Client} Client Your Discord Client goes in here
    * @param {"youtube" | "poker" | "betrayal" | "fishing" | "chess" | "lettertile" | "wordsnack" | "awkword" | "doodlecrew" | "spellcast" | "checkers"} GameName Name of the game goes in here
    * @param {Number} MaxDuration Maximum duration (number in seconds) of the game event goes in here.
    */
    constructor(Client, GameName, MaxDuration)
    {
        this.Client = Client;
        this.GameName = GameName;
        this.MaxDuration = MaxDuration;
    };

   /**
    * @returns {Array} An array of the available games
    */
    gameNames() { return appNames };

   /**
    * @typedef { {code: String, inviteLink: String, createdAt: Date, validTill: Date, guild: { ID: Number, name: String }, channel: { ID: Number, name: String }, inviter: { ID: Number, name: String }, app: { ID: Number, name: String, description: String, summary: String, maxMembers: String}} } result
    */
   /**
    * Creates an invite to play the game in a voice channel
    * @param {Discord.VoiceChannel} VoiceChannel
    * @returns {Promise<result>} A parsed JSON object { . . . . . }
    */
    play(VoiceChannel)
    {
        return new Promise((result) =>
        {
            if (!this.Client) throw new Error('No client was provided !');

            if (VoiceChannel) 
            {
                if (VoiceChannel.id === undefined) throw new Error('Invalid Voice Chnanel !');
            }

            else { throw new Error('No Voice Channel was provided !'); }

            if (this.GameName)
            {
                if (!appNames.some(x => x === this.GameName)) throw new Error('Invalid game name. Game name can only be any of the these\n' + appNames.join(', '));
            }

            else { throw new Error('No Game name was provided !'); }

            if (this.MaxDuration === 0) throw new Error('No time limit was given to the game event !');

            if (typeof(this.MaxDuration) !== 'number')
            {
                if (this.MaxDuration === true) { this.MaxDuration = 0; }

                else { throw new Error('The time limit should be more than 0 and be in the form of a number in seconds !'); }
            }

            //

            const body_data = { max_age: this.MaxDuration, target_application_id: appID[this.GameName], target_type: 2, temporary: false };
    
            const body = JSON.stringify(body_data);
    
            const headers = { authorization: 'Bot ' + this.Client.token, 'content-type' : 'application/json' };
    
            const URL = `https://discord.com/api/v8/channels/${VoiceChannel.id}/invites`;

            //
    
            fetch.default(URL, { method: 'POST', body: body, headers: headers }).then(x => x.json()).then((data) =>
            {
                if (data.message === '401: Unauthorized') throw new Error(data.message + '. Invalid client !');

                if (data.message === 'Missing Permissions') throw new Error(data.message + '. The bot doesn\'t have the permission to create invites to the channel.');

                const finalResult =
                {
                    "code" : data.code,
                    "inviteLink" : `https://discord.com/invite/${data.code}`,
                    "createdAt" : new Date(data.created_at),
                    "validTill" : new Date(data.expires_at),

                    "guild" :
                    {
                        "ID" : parseInt(data.guild.id),
                        "name" : data.guild.name
                    },

                    "channel" :
                    {
                        "ID" : parseInt(data.channel.id),
                        "name" : data.channel.name
                    },

                    "inviter" : 
                    {
                        "ID" : parseInt(data.inviter.id),
                        "name" : data.inviter.username
                    },

                    "app" :
                    {
                        "ID" : parseInt(data.target_application.id),
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
};

module.exports = DiscordGames;