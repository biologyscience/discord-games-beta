const fetch = require('node-fetch');

const
    appID =
    {
        youtube : '880218394199220334',
        poker : '755827207812677713',
        betrayal : '773336526917861400',
        fishing : '814288819477020702',
        chess : '832012774040141894',
        letterLeague : '879863686565621790',
        wordSnack : '879863976006127627',
        doodleCrew : '878067389634314250',
        awkword : '879863881349087252',
        spellCast : '852509694341283871',
        checkers : '832013003968348200',
        sketchHeads : '902271654783242291',
        blazing8s: '832025144389533716',
        landIO: '903769130790969345',
        puttParty: '945737671223947305',
        bobbleLeague: '947957217959759964',
        askAway: '976052223358406656'
    },
    
    appNames =
    [
        'youtube',
        'poker',
        'betrayal',
        'fishing',
        'chess',
        'letterLeague',
        'wordSnack', 
        'awkword',
        'doodleCrew',
        'spellCast',
        'checkers',
        'sketchHeads',
        'blazing8s',
        'landIO',
        'puttParty',
        'bobbleLeague',
        'askAway'
    ],

    errors =
    {
        no :
        {
            token : 'No token was provided !\n',
            vc : 'No Voice Channel was provided !\n',
            gameName : 'No Game name was provided !\n',
            time : 'No time limit was given to the game event !\n'
        },
        
        invalid :
        {
            token : 'Invalid bot token !\n',
            vc : 'Invalid Voice Chnanel !\n',
            gameName : 'Invalid game name. Game name can only be any of the these\n' + appNames.join(' ') + '\n',
            time : 'The time limit should be more than 0 and be in the form of a number in hours !\n'
        },

        exccedTime : 'The time limit cannot be more than a week, the maximum time limit is \'168 hours\'\nIf you don\'t want your link to get expired, you can set the \'neverExpire\' parameter to true in the options of the constructor\n',
        missingPerms : 'The bot doesn\'t have the permission to create invites to the channel.\n'
    };

class DiscordGames
{
   /**
    * @typedef {'youtube' | 'poker' | 'betrayal' | 'fishing' | 'chess' | 'letterLeague' | 'wordSnack' | 'awkword' | 'doodleCrew' | 'spellCast' | 'checkers' | 'sketchHeads' | 'blazing8s' | 'landIO' | 'puttParty' | 'bobbleLeague' | 'askAway'} NameOfTheGame
    * @typedef { {code: String, inviteLink: String, createdAt: Date, validTill: Date | String, guild: { ID: String, name: String }, channel: { ID: String, name: String }, inviter: { ID: String, name: String }, app: { ID: String, name: String, description: String, summary: String, maxMembers: String, icon: String}} } result
    */

   /**
    * @param {String} BotToken Your Discord Bot's Token goes in here
    * @param {NameOfTheGame} GameName Name of the game goes in here
    * @param {Number} MaxDuration Maximum duration (number in hours) of the game event goes in here
    * @param {{neverExpire: Boolean}=} Options
    */
    constructor(BotToken, GameName, MaxDuration, Options)
    {
        this.BotToken = BotToken;
        this.GameName = GameName;
        this.MaxDuration = MaxDuration;

        if (Options) { this.neverExpire = Options.neverExpire; }

        else { this.neverExpire = null; }
    };

   /**
    * @returns {String} A list of the available games
    */
    gameNames() { return appNames.join('\n'); };

   /**
    * Creates an invite to play the game in a voice channel
    * @param {Discord.VoiceChannel} VoiceChannel
    * @returns {Promise<result>} A parsed JSON object { . . . . . }
    */
    play(VoiceChannel)
    {
        return new Promise((result) =>
        {
            if (this.BotToken === undefined) throw new Error(errors.no.token);
            if (typeof(this.BotToken) !== 'string') throw new Error(errors.invalid.token);
            if (this.GameName === undefined) throw new Error(errors.no.gameName);
            if (this.GameName && appNames.includes(this.GameName) === false) throw new Error(errors.invalid.gameName);
            if (this.MaxDuration === undefined) throw new Error(errors.no.time);
            if (typeof(this.MaxDuration) === 'number' && this.MaxDuration > 168) throw new Error(errors.exccedTime);
            if (typeof(this.MaxDuration) === 'number' && this.MaxDuration === 0) throw new Error(errors.invalid.time);
            if (typeof(this.MaxDuration) !== 'number') throw new Error(errors.invalid.time);
            if ([undefined, null].includes(VoiceChannel)) throw new Error(errors.no.vc);
            if (VoiceChannel.id === undefined) throw new Error(errors.invalid.vc);

            let time = this.MaxDuration;

            if (this.neverExpire === true) { time = 0; }

            const body_data = { max_age: time * 3600, target_application_id: appID[this.GameName], target_type: 2, temporary: false };
    
            const body = JSON.stringify(body_data);
    
            const headers = { authorization: 'Bot ' + this.BotToken, 'content-type' : 'application/json' };
    
            const URL = 'https://discord.com/api/v10/channels/' + VoiceChannel.id + '/invites';
    
            fetch.default(URL, { method: 'POST', body: body, headers: headers }).then(x => x.json()).then((data) =>
            {
                if (data.message === '401: Unauthorized') throw new Error(data.message + '. ' + errors.invalid.token);

                if (data.message === 'Missing Permissions') throw new Error(data.message + '. ' + errors.missingPerms);

                const finalResult =
                {
                    code : data.code,
                    inviteLink : 'https://discord.gg/' + data.code,
                    createdAt : new Date(data.created_at),
                    validTill : time === 0 ? 'This invite link will not expire automatically, because `neverExpire` was set to `true`' : new Date(data.expires_at),

                    guild :
                    {
                        ID : data.guild.id,
                        name : data.guild.name
                    },

                    channel :
                    {
                        ID : data.channel.id,
                        name : data.channel.name
                    },

                    inviter : 
                    {
                        ID : data.inviter.id,
                        name : data.inviter.username
                    },

                    app :
                    {
                        ID : data.target_application.id,
                        name : data.target_application.name,
                        description : data.target_application.description,
                        summary : data.target_application.summary,
                        maxMembers : data.target_application.max_participants === null ? 'null' : data.target_application.max_participants,
                        icon : data.target_application.icon
                    }
                };

                result(finalResult);
            });
        });
    };
};

module.exports = DiscordGames;