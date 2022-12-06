const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/teams', async (req, res) => {
    const { data } = await axios.get('https://statsapi.web.nhl.com/api/v1/teams');

    let teams = [];
    data.teams.forEach((team) => {
        let nameSplit = team.name.split(" ");
        let imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-';
        nameSplit.forEach((word, index) => {
            if (index === nameSplit.length-1) {
                imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
            } else {
                imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
            }
        });

        let teamObject = {
            teamId: team.id,
            name: team.name,
            venue: {
                name: team.venue.name,
                city: team.venue.city
            },
            abbreviation: team.abbreviation,
            firstYearOfPlay: team.firstYearOfPlay,
            division: team.division.name,
            conference: team.conference.name,
            imageUrl: imageUrlPrefix
        };
        teams.push(teamObject);
    });

    res.json(teams);
});

router.get('/teams/:id', async (req, res) => {
    try {
        const { data } = await axios.get(`https://statsapi.web.nhl.com/api/v1/teams/${req.params.id}?expand=team.roster`);

        let imageUrlPrefix = undefined;
        if (data.teams[0].name === 'Atlanta Thrashers') {
            imageUrlPrefix = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Atlanta_Thrashers.svg/1200px-Atlanta_Thrashers.svg.png';
        } else {
            let nameSplit = data.teams[0].name.split(" ");
            imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-';
            nameSplit.forEach((word, index) => {
                if (index === nameSplit.length-1) {
                    imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                } else {
                    imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                }
            });
        }

        let players = [];
        data.teams[0].roster.roster.forEach((player) => {
            let playerObject = {
                playerId: player.person.id,
                name: player.person.fullName,
                jerseyNumber: player.jerseyNumber,
                position: player.position.abbreviation
            };
            players.push(playerObject);
        });

        let teamObject = {
            teamId: data.teams[0].id,
            name: data.teams[0].name,
            venue: {
                name: data.teams[0].venue.name,
                city: data.teams[0].venue.city
            },
            abbreviation: data.teams[0].abbreviation,
            firstYearOfPlay: data.teams[0].firstYearOfPlay,
            division: data.teams[0].division.name,
            conference: data.teams[0].conference.name,
            imageUrl: imageUrlPrefix,
            players: players
        };

        return res.json(teamObject);
    } catch (e) {
        return res.status(404).json({error: `A team with that ID (${req.params.teamId}) does not exist!`});
    }
});

router.get('/schedule/:date', async (req, res) => {
    const { data } = await axios.get(`https://statsapi.web.nhl.com/api/v1/schedule?expand=schedule.broadcasts&date=${req.params.date}`);

    let games = [];
    if (data.dates.length > 0) {
        data.dates[0].games.forEach((game) => {
            let imageUrlPrefixAway = undefined;
            if (game.teams.away.team.name === 'Atlanta Thrashers') {
                imageUrlPrefixAway = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Atlanta_Thrashers.svg/1200px-Atlanta_Thrashers.svg.png';
            } else if (game.teams.away.team.name === 'Phoenix Coyotes') {
                imageUrlPrefixAway = 'https://loodibee.com/wp-content/uploads/nhl-arizona-coyotes-logo.png';
            } else if (game.teams.away.team.name === 'Ottawa Senators (1917)') {
                imageUrlPrefixAway = 'https://1000logos.net/wp-content/uploads/2018/06/Ottawa-Senators-Logo-1917.jpg';
            } else if (game.teams.away.team.name === 'Hamilton Tigers') {
                imageUrlPrefixAway = 'https://i.pinimg.com/originals/ea/76/df/ea76dfafe8420712011de51fbdfb0027.gif';
            } else if (game.teams.away.team.name === 'Toronto St. Patricks') {
                imageUrlPrefixAway = 'https://content.sportslogos.net/logos/1/997/full/280.png';
            } else if (game.teams.away.team.name === 'Montreal Maroons') {
                imageUrlPrefixAway = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Montreal_Maroons_Logo_Dark_Logo.svg/1200px-Montreal_Maroons_Logo_Dark_Logo.svg.png';
            } else {
                let nameSplitAway = game.teams.away.team.name.split(" ");
                imageUrlPrefixAway = 'https://loodibee.com/wp-content/uploads/nhl-';
                nameSplitAway.forEach((word, index) => {
                    if (index === nameSplitAway.length-1) {
                        imageUrlPrefixAway += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                    } else {
                        imageUrlPrefixAway += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                    }
                });
            }

            let imageUrlPrefixHome = undefined;
            if (game.teams.home.team.name === 'Atlanta Thrashers') {
                imageUrlPrefixHome = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Atlanta_Thrashers.svg/1200px-Atlanta_Thrashers.svg.png';
            } else if (game.teams.home.team.name === 'Phoenix Coyotes') {
                imageUrlPrefixHome = 'https://loodibee.com/wp-content/uploads/nhl-arizona-coyotes-logo.png';
            } else if (game.teams.home.team.name === 'Ottawa Senators (1917)') {
                imageUrlPrefixHome = 'https://1000logos.net/wp-content/uploads/2018/06/Ottawa-Senators-Logo-1917.jpg';
            } else if (game.teams.home.team.name === 'Hamilton Tigers') {
                imageUrlPrefixHome = 'https://i.pinimg.com/originals/ea/76/df/ea76dfafe8420712011de51fbdfb0027.gif';
            } else if (game.teams.home.team.name === 'Toronto St. Patricks') {
                imageUrlPrefixHome = 'https://content.sportslogos.net/logos/1/997/full/280.png';
            } else if (game.teams.home.team.name === 'Montreal Maroons') {
                imageUrlPrefixHome = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Montreal_Maroons_Logo_Dark_Logo.svg/1200px-Montreal_Maroons_Logo_Dark_Logo.svg.png';
            } else {
                let nameSplitHome = game.teams.home.team.name.split(" ");
                imageUrlPrefixHome = 'https://loodibee.com/wp-content/uploads/nhl-';
                nameSplitHome.forEach((word, index) => {
                    if (index === nameSplitHome.length-1) {
                        imageUrlPrefixHome += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                    } else {
                        imageUrlPrefixHome += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                    }
                });
            }

            let broadcasts = [];
            if (game.broadcasts) {
                game.broadcasts.forEach((broadcast) => {
                    broadcasts.push(broadcast.name);
                });
            }

            let broadcastString = '';
            broadcasts.forEach((broadcast, index) => {
                if (index === broadcasts.length-1) {
                    broadcastString += broadcast;
                } else {
                    broadcastString += `${broadcast}, `;
                }
            });

            let gameObject = {
                id: game.gamePk,
                teams: {
                    away: {
                        teamId: game.teams.away.team.id,
                        name: game.teams.away.team.name,
                        record: `${game.teams.away.leagueRecord.wins}-${game.teams.away.leagueRecord.losses}-${game.teams.away.leagueRecord.ot}`,
                        imageUrl: imageUrlPrefixAway,
                        score: game.teams.away.score
                    },
                    home: {
                        teamId: game.teams.home.team.id,
                        name: game.teams.home.team.name,
                        record: `${game.teams.home.leagueRecord.wins}-${game.teams.home.leagueRecord.losses}-${game.teams.home.leagueRecord.ot}`,
                        imageUrl: imageUrlPrefixHome,
                        score: game.teams.home.score
                    }
                },
                venue: game.venue.name,
                status: game.status.detailedState,
                broadcasts: broadcastString || 'TBD'
            }
            games.push(gameObject);
        });
    } else {
        return res.json([]);
    }

    return res.json(games);
});

router.get('/standings', async (req, res) => {
    const { data } = await axios.get('https://statsapi.web.nhl.com/api/v1/standings');

    let standings = [];
    data.records.forEach((record) => {
        let divisionStandings = [];
        record.teamRecords.forEach((teamRecord) => {
            let imageUrlPrefix = undefined;
            if (teamRecord.team.name === 'Atlanta Thrashers') {
                imageUrlPrefix = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Atlanta_Thrashers.svg/1200px-Atlanta_Thrashers.svg.png';
            } else if (teamRecord.team.name === 'Phoenix Coyotes') {
                imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-arizona-coyotes-logo.png';
            } else if (teamRecord.team.name === 'Ottawa Senators (1917)') {
                imageUrlPrefix = 'https://1000logos.net/wp-content/uploads/2018/06/Ottawa-Senators-Logo-1917.jpg';
            } else if (teamRecord.team.name === 'Hamilton Tigers') {
                imageUrlPrefix = 'https://i.pinimg.com/originals/ea/76/df/ea76dfafe8420712011de51fbdfb0027.gif';
            } else if (teamRecord.team.name === 'Toronto St. Patrick') {
                imageUrlPrefix = 'https://content.sportslogos.net/logos/1/997/full/280.png';
            } else if (teamRecord.team.name === 'Montreal Maroons') {
                imageUrlPrefix = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Montreal_Maroons_Logo_Dark_Logo.svg/1200px-Montreal_Maroons_Logo_Dark_Logo.svg.png';
            } else {
                let nameSplit = teamRecord.team.name.split(" ");
                imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-';
                nameSplit.forEach((word, index) => {
                    if (index === nameSplit.length-1) {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                    } else {
                        imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                    }
                });
            }

            let recordObject = {
                id: teamRecord.team.id,
                division: record.division.name,
                name: teamRecord.team.name,
                wins: teamRecord.leagueRecord.wins,
                losses: teamRecord.leagueRecord.losses,
                ot: teamRecord.leagueRecord.ot,
                goalsAgainst: teamRecord.goalsAgainst,
                goalsScored: teamRecord.goalsScored,
                goalDifferential: teamRecord.goalsScored - teamRecord.goalsAgainst,
                points: teamRecord.points,
                divisionRank: teamRecord.divisionRank,
                conferenceRank: teamRecord.conferenceRank,
                leagueRank: teamRecord.leagueRank,
                gamesPlayed: teamRecord.gamesPlayed,
                streak: teamRecord.streak.streakCode,
                pointsPercentage: teamRecord.pointsPercentage.toFixed(3),
                imageUrl: imageUrlPrefix
            };
            divisionStandings.push(recordObject);
        });
        standings.push(divisionStandings);
    });

    res.json(standings);
});

router.get('/linescore/:id', async (req, res) => {
    const { data } = await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${req.params.id}/linescore`);

    let gameObject = {
        currentPeriod: data.currentPeriodOrdinal,
        currentPeriodTimeRemaining: data.currentPeriodTimeRemaining,
        home: {
            shots: data.teams.home.shotsOnGoal
        },
        away: {
            shots: data.teams.away.shotsOnGoal
        }
    };

    res.json(gameObject);
});

router.get('/goals/:id', async (req, res) => {
    const { data } = await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${req.params.id}/feed/live`);

    let imageUrlPrefixAway = undefined;
    if (data.gameData.teams.away.name === 'Atlanta Thrashers') {
        imageUrlPrefixAway = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Atlanta_Thrashers.svg/1200px-Atlanta_Thrashers.svg.png';
    } else if (data.gameData.teams.away.name === 'Phoenix Coyotes') {
        imageUrlPrefixAway = 'https://loodibee.com/wp-content/uploads/nhl-arizona-coyotes-logo.png';
    } else if (data.gameData.teams.away.name === 'Ottawa Senators (1917)') {
        imageUrlPrefixAway = 'https://1000logos.net/wp-content/uploads/2018/06/Ottawa-Senators-Logo-1917.jpg';
    } else if (data.gameData.teams.away.name === 'Hamilton Tigers') {
        imageUrlPrefixAway = 'https://i.pinimg.com/originals/ea/76/df/ea76dfafe8420712011de51fbdfb0027.gif';
    } else if (data.gameData.teams.away.name === 'Toronto St. Patricks') {
        imageUrlPrefixAway = 'https://content.sportslogos.net/logos/1/997/full/280.png';
    } else if (data.gameData.teams.away.name === 'Montreal Maroons') {
        imageUrlPrefixAway = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Montreal_Maroons_Logo_Dark_Logo.svg/1200px-Montreal_Maroons_Logo_Dark_Logo.svg.png';
    } else {
        let nameSplitAway = data.gameData.teams.away.name.split(" ");
        imageUrlPrefixAway = 'https://loodibee.com/wp-content/uploads/nhl-';
        nameSplitAway.forEach((word, index) => {
            if (index === nameSplitAway.length-1) {
                imageUrlPrefixAway += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
            } else {
                imageUrlPrefixAway += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
            }
        });
    }

    let imageUrlPrefixHome = undefined;
    if (data.gameData.teams.home.name === 'Atlanta Thrashers') {
        imageUrlPrefixHome = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Atlanta_Thrashers.svg/1200px-Atlanta_Thrashers.svg.png';
    } else if (data.gameData.teams.home.name === 'Phoenix Coyotes') {
        imageUrlPrefixHome = 'https://loodibee.com/wp-content/uploads/nhl-arizona-coyotes-logo.png';
    } else if (data.gameData.teams.home.name === 'Ottawa Senators (1917)') {
        imageUrlPrefixHome = 'https://1000logos.net/wp-content/uploads/2018/06/Ottawa-Senators-Logo-1917.jpg';
    } else if (data.gameData.teams.home.name === 'Hamilton Tigers') {
        imageUrlPrefixHome = 'https://i.pinimg.com/originals/ea/76/df/ea76dfafe8420712011de51fbdfb0027.gif';
    } else if (data.gameData.teams.home.name === 'Toronto St. Patricks') {
        imageUrlPrefixHome = 'https://content.sportslogos.net/logos/1/997/full/280.png';
    } else if (data.gameData.teams.home.name === 'Montreal Maroons') {
        imageUrlPrefixHome = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Montreal_Maroons_Logo_Dark_Logo.svg/1200px-Montreal_Maroons_Logo_Dark_Logo.svg.png';
    } else {
        let nameSplitHome = data.gameData.teams.home.name.split(" ");
        imageUrlPrefixHome = 'https://loodibee.com/wp-content/uploads/nhl-';
        nameSplitHome.forEach((word, index) => {
            if (index === nameSplitHome.length-1) {
                imageUrlPrefixHome += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
            } else {
                imageUrlPrefixHome += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
            }
        });
    }

    let goals = [];
    data.liveData.plays.allPlays.forEach((play) => {        
        if (play.result.event === "Goal") {
            let imageUrl = undefined;
            if (data.gameData.teams.away.name === play.team.name) {
                imageUrl = imageUrlPrefixAway;
            } else {
                imageUrl = imageUrlPrefixHome;
            }

            let goalObject = {
                team: play.team.triCode,
                description: play.result.description,
                period: play.about.ordinalNum,
                time: play.about.periodTime,
                imageUrl: imageUrl
            };
            goals.push(goalObject);
        }
    });

    res.json(goals);
});

router.get('/player/:id', async (req, res) => {
    try {
        let currentSeason = `${new Date().getFullYear()}${(new Date().getFullYear())+1}`;
        const { data } = await axios.get(`https://statsapi.web.nhl.com/api/v1/people/${req.params.id}/stats/?stats=statsSingleSeason&season=${currentSeason}`);

        if (data.stats && data.stats.length > 0 && data.stats[0].splits && data.stats[0].splits.length > 0) {
            let statsObject = {
                goals: data.stats[0].splits[0].stat.goals || 0,
                assists: data.stats[0].splits[0].stat.assists || 0,
                points: data.stats[0].splits[0].stat.points || 0,
                pim: data.stats[0].splits[0].stat.pim || 0,
                shots: data.stats[0].splits[0].stat.shots || 0,
                shotPercentage: data.stats[0].splits[0].stat.shotPct || 0,
                hits: data.stats[0].splits[0].stat.hits || 0,
                powerPlayGoals: data.stats[0].splits[0].stat.powerPlayGoals || 0,
                blocks: data.stats[0].splits[0].stat.blocked || 0,
                plusMinus: data.stats[0].splits[0].stat.plusMinus || 0,
                timeOnIcePerGame: data.stats[0].splits[0].stat.timeOnIcePerGame || '00:00'
            };

            res.json(statsObject);
        } else {
            res.json({
                goals: 0,
                assists: 0,
                points: 0,
                pim: 0,
                shots: 0,
                shotPercentage: 0,
                hits: 0,
                powerPlayGoals: 0,
                blocks: 0,
                plusMinus: 0,
                timeOnIcePerGame: '00:00'
            });
        }
    } catch (e) {
        console.log(e);
    }
});

router.get('/topscorers/:date', async (req, res) => {
    const { data } = await axios.get(`https://statsapi.web.nhl.com/api/v1/schedule?date=${req.params.date}`);

    let gameIds = [];
    if (data.dates.length > 0) {
        data.dates[0].games.forEach((game) => {
            gameIds.push(game.gamePk);
        })
    }

    let scorers = {};
    for (let i = 0; i < gameIds.length; i++) {
        const { data } = await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${gameIds[i]}/feed/live`);

        data.liveData.plays.allPlays.forEach((play) => {        
            if (play.result.event === "Goal") {
                play.players.forEach((player) => {
                    if (player.playerType === "Scorer" || player.playerType === "Assist") {
                        let playerName = player.player.fullName;
                        if (scorers[playerName]) {
                            scorers[playerName].points = scorers[playerName].points + 1;
                            if (player.playerType === "Scorer") {
                                scorers[playerName].goals = scorers[playerName].goals + 1;
                            } else {
                                scorers[playerName].assists = scorers[playerName].assists + 1;
                            }
                        } else {
                            if (player.playerType === "Scorer") {
                                scorers[playerName] = {
                                    points: 1,
                                    goals: 1,
                                    assists: 0,
                                    team: play.team.name
                                };
                            } else {
                                scorers[playerName] = {
                                    points: 1,
                                    goals: 0,
                                    assists: 1,
                                    team: play.team.name
                                };
                            }
                        }
                    }
                });
            }
        });
    }

    let top = [];
    for (let player in scorers) {
        top.push([player, scorers[player].points, scorers[player].team, scorers[player].goals, scorers[player].assists]);
    }

    top.sort(function(a, b) {
        return b[1] - a[1];
    });

    for (let i = 0; i < top.length; i++) {
        let imageUrlPrefix = undefined;
        if (top[i][2] === 'Atlanta Thrashers') {
            imageUrlPrefix = 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Atlanta_Thrashers.svg/1200px-Atlanta_Thrashers.svg.png';
        } else if (top[i][2] === 'Phoenix Coyotes') {
            imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-arizona-coyotes-logo.png';
        } else if (top[i][2] === 'Ottawa Senators (1917)') {
            imageUrlPrefix = 'https://1000logos.net/wp-content/uploads/2018/06/Ottawa-Senators-Logo-1917.jpg';
        } else if (top[i][2] === 'Hamilton Tigers') {
            imageUrlPrefix = 'https://i.pinimg.com/originals/ea/76/df/ea76dfafe8420712011de51fbdfb0027.gif';
        } else if (top[i][2] === 'Toronto St. Patricks') {
            imageUrlPrefix = 'https://content.sportslogos.net/logos/1/997/full/280.png';
        } else if (top[i][2] === 'Montreal Maroons') {
            imageUrlPrefix = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Montreal_Maroons_Logo_Dark_Logo.svg/1200px-Montreal_Maroons_Logo_Dark_Logo.svg.png';
        } else {
            let nameSplit = top[i][2].split(" ");
            imageUrlPrefix = 'https://loodibee.com/wp-content/uploads/nhl-';
            nameSplit.forEach((word, index) => {
                if (index === nameSplit.length-1) {
                    imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-logo.png`;
                } else {
                    imageUrlPrefix += `${word.toLowerCase().replace('.', '').replace('é', 'e')}-`;
                }
            });
        }
        top[i].push(imageUrlPrefix);
    }

    res.json(top.splice(0,5));
});

module.exports = router;