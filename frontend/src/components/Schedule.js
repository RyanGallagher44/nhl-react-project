import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import {
    Card,
    Grid,
    Paper,
    List,
    ListItem,
    ListSubheader
} from '@mui/material';
import at from '../img/at.png';
import {DateTime} from 'luxon';

const Schedule = () => {
    const [scheduleData, setScheduleData] = useState(undefined);
    const [gameData, setGameData] = useState([]);
    const [goalData, setGoalData] = useState([]);
    const [topData, setTopData] = useState([]);
    const [loading, setLoading] = useState(true);
    const {date} = useParams();

    useEffect(() => {
        setLoading(true);
        async function fetchData() {
            try {
                let { data } = await axios.get(`http://localhost:3030/schedule/${date}`);
                setScheduleData(data);

                let gameIds = [];
                data.forEach((game) => {
                    gameIds.push(game.id);
                    return game;
                });

                let games = [];
                for (let i = 0; i < gameIds.length; i++) {
                    try {
                        const { data } = await axios.get(`http://localhost:3030/linescore/${gameIds[i]}`);
                        games.push(data);
                    } catch (e) {
                        console.log(e);
                    }
                }
                setGameData(games);

                let goals = [];
                for (let i = 0; i < gameIds.length; i++) {
                    try {
                        const { data } = await axios.get(`http://localhost:3030/goals/${gameIds[i]}`);
                        goals.push(data);
                    } catch (e) {
                        console.log(e);
                    }
                }
                setGoalData(goals);

                ({ data } = await axios.get(`http://localhost:3030/topscorers/${date}`));
                setTopData(data);
                
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }

        if (date) {
            fetchData();
        }
    }, [date]);

    const buildGame = (game, linescore, goals, endStatus) => {
        return(
            <Grid item xs={4} key={`${game.teams.away.teamId}${game.teams.home.teamId}`}>
                <Card
                    sx={{
                        background: '#282C34',
                        minHeight: '650px',
                        padding: '10px',
                        margin: '20px'
                    }}
                >
                    {game.status !== 'In Progress' &&
                        <h1>{game.status}{endStatus}</h1>
                    }
                    {game.status === 'In Progress' && linescore.currentPeriod &&
                        <h1>{linescore.currentPeriod} - {linescore.currentPeriodTimeRemaining}</h1>
                    }
                    <div className="game-div">
                        <div>
                            <Link className="team-link" to={`/teams/${game.teams.away.teamId}`}>
                                <img
                                    width="50px"
                                    src={`${game.teams.away.imageUrl}`}
                                    alt={`${game.teams.away.name}`}
                                />
                                {game.status !== 'In Progress' && game.status !== 'Final' &&
                                    <h1>{game.teams.away.record}</h1>
                                }
                                {game.status === 'Final' && game.teams.away.score < game.teams.home.score &&
                                    <div>
                                        <h1>{game.teams.away.score}</h1>
                                        <h5>Shots: {linescore.away.shots}</h5>
                                    </div>
                                }
                                {game.status === 'Final' && game.teams.away.score > game.teams.home.score &&
                                    <div>
                                        <h1 className="game-winner">{game.teams.away.score}</h1>
                                        <h5 className="game-winner">Shots: {linescore.away.shots}</h5>
                                    </div>
                                }
                                {game.status === 'Final' && game.teams.away.score === game.teams.home.score &&
                                    <div>
                                        <h1>{game.teams.away.score}</h1>
                                        <h5>Shots: {linescore.away.shots}</h5>
                                    </div>
                                }
                                {game.status === 'In Progress' &&
                                    <div>
                                        <h1>{game.teams.away.score}</h1>
                                        <h5>Shots: {linescore.away.shots}</h5>
                                    </div>
                                }
                            </Link>
                        </div>
                        <div>
                            <img
                                className="at-symbol"
                                width="15px"
                                src={at}
                                alt='at sign'
                            />
                        </div>
                        <div>
                            <Link className="team-link" to={`/teams/${game.teams.home.teamId}`}>
                                <img
                                    width="50px"
                                    src={`${game.teams.home.imageUrl}`}
                                    alt={`${game.teams.home.name}`}
                                />
                                {game.status !== 'In Progress' && game.status !== 'Final' &&
                                    <h1>{game.teams.home.record}</h1>
                                }
                                {game.status === 'Final' && game.teams.home.score < game.teams.away.score &&
                                    <div>
                                        <h1>{game.teams.home.score}</h1>
                                        <h5>Shots: {linescore.home.shots}</h5>
                                    </div>
                                }
                                {game.status === 'Final' && game.teams.home.score > game.teams.away.score &&
                                    <div>
                                        <h1 className="game-winner">{game.teams.home.score}</h1>
                                        <h5 className="game-winner">Shots: {linescore.home.shots}</h5>
                                    </div>
                                }
                                {game.status === 'Final' && game.teams.home.score === game.teams.away.score &&
                                    <div>
                                        <h1>{game.teams.home.score}</h1>
                                        <h5>Shots: {linescore.home.shots}</h5>
                                    </div>
                                }
                                {game.status === 'In Progress' &&
                                    <div>
                                        <h1>{game.teams.home.score}</h1>
                                        <h5>Shots: {linescore.home.shots}</h5>
                                    </div>
                                }
                            </Link>
                        </div>
                    </div>
                    {goals.length > 0 &&
                        <div>
                            <h3>Box Score</h3>
                            <Paper style={{maxHeight: 200, overflow: 'auto', backgroundColor: '#1f1f1f', color: '#e1e1e1'}}>
                                <List
                                    subheader={<li />}
                                >
                                    {[1, 2, 3, 4, 5].map((period) => {
                                        return(
                                            <div>
                                                {checkGoalsInPeriod(goals, period) &&
                                                    <ListSubheader
                                                        sx={{
                                                            background: '#121212',
                                                            color: '#e1e1e1'
                                                        }}
                                                    >
                                                        {getOrdinalNum(period)}
                                                    </ListSubheader>
                                                }
                                                {goals.map((goal) => {
                                                    return(
                                                        <div>
                                                            {getOrdinalNum(period) === goal.period &&
                                                                <ListItem key={Math.random()} style={{display: 'flex', justifyContent: 'space-evenly'}}>
                                                                    <img
                                                                        className="goal-img"
                                                                        width="25px"
                                                                        src={`${goal.imageUrl}`}
                                                                        alt={`${goal.team} logo`}
                                                                    />
                                                                    {goal.description}
                                                                    <div className="goal-time">
                                                                        {goal.time} / {goal.period}
                                                                    </div>
                                                                </ListItem>
                                                            }
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </List>
                            </Paper>
                        </div>
                    }
                    <h3>Location: {game.venue}</h3>
                    <hr />
                    <h3>Watch on: {game.broadcasts}</h3>
                </Card>
            </Grid>
        );
    };

    const checkGoalsInPeriod = (goals, period) => {
        let count = 0;
        if (period === 1) {
            goals.forEach((goal) => {
                if (goal.period === '1st') {
                    count++;
                }
            });
        }

        if (period === 2) {
            goals.forEach((goal) => {
                if (goal.period === '2nd') {
                    count++;
                }
            });
        }

        if (period === 3) {
            goals.forEach((goal) => {
                if (goal.period === '3rd') {
                    count++;
                }
            });
        }

        if (period === 4) {
            goals.forEach((goal) => {
                if (goal.period === 'OT') {
                    count++;
                }
            });
        }

        if (period === 5) {
            goals.forEach((goal) => {
                if (goal.period === 'SO') {
                    count++;
                }
            });
        }

        return (count > 0);
    };

    const getOrdinalNum = (num) => {
        let ordinals = [
            'st',
            'nd',
            'rd',
            'OT',
            'SO'
        ];

        if (num !== 4 && num != 5) {
            return `${num}${ordinals[num-1]}`;
        } else {
            return `${ordinals[num-1]}`;
        }
    };

    const buildCurrentDateString = (date) => {
        let dateArr = date.split("-");
        let ordinalKey = parseInt(dateArr[2]) % 10;
        
        let ordinals = [
            'th',
            'st',
            'nd',
            'rd',
            'th',
            'th',
            'th',
            'th',
            'th',
            'th',
        ]

        let months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ]

        return `${months[parseInt(dateArr[1])-1]} ${parseInt(dateArr[2])}${ordinals[ordinalKey]}, ${dateArr[0]}`;
    };

    const getYesterday = (date) => {
        let yesterday = DateTime.fromISO(date);
        yesterday = (function(d){ d.setDate(d.getDate()-1); return d})(yesterday.toJSDate());

        let dateString = undefined;
        let day = undefined;
        let month = undefined;
        if (yesterday.getDate() < 10) {
            day = `0${yesterday.getDate()}`;
        } else {
            day = `${yesterday.getDate()}`;
        }

        if (yesterday.getMonth()+1 < 10) {
            month = `0${yesterday.getMonth()+1}`;
        } else {
            month = `${yesterday.getMonth()+1}`;
        }

        dateString = `${yesterday.getFullYear()}-${month}-${day}`;
        
        return dateString;
    };

    const getTomorrow = (date) => {
        let tomorrow = DateTime.fromISO(date);
        tomorrow = (function(d){ d.setDate(d.getDate()+1); return d})(tomorrow.toJSDate());

        let dateString = undefined;
        let day = undefined;
        let month = undefined;
        if (tomorrow.getDate() < 10) {
            day = `0${tomorrow.getDate()}`;
        } else {
            day = `${tomorrow.getDate()}`;
        }

        if (tomorrow.getMonth()+1 < 10) {
            month = `0${tomorrow.getMonth()+1}`;
        } else {
            month = `${tomorrow.getMonth()+1}`;
        }

        dateString = `${tomorrow.getFullYear()}-${month}-${day}`;

        return dateString;
    };

    if (loading) {
        return(
            <div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <img
                    width="200px"
                    src={require('../img/loading.gif')}
                    alt="loading..."
                />
            </div>
        );
    } else {
        return(
            <div>
                <div className="flex-link date-selection-div">
                    <Link className="root-link" to={`/schedule/${getYesterday(date)}`}>
                        {buildCurrentDateString(getYesterday(date))}
                    </Link>
                    <h1 className="current-date">{buildCurrentDateString(date)}</h1>
                    <Link className="root-link" to={`/schedule/${getTomorrow(date)}`}>
                        {buildCurrentDateString(getTomorrow(date))}
                    </Link>
                </div>
                <br />
                <h3>Top 5 Scorers</h3>
                <Paper
                    style={{
                        minHeight: '100%',
                        overflow: 'auto',
                        backgroundColor: '#1f1f1f',
                        color: '#e1e1e1',
                        width: '50%',
                        marginLeft: '25%'
                    }}
                >
                    <List>
                        {topData.map((player) => {
                            console.log(player);
                            return(
                                <div>
                                    <ListItem key={Math.random()} style={{display: 'flex', justifyContent: 'space-evenly'}}>
                                        <img
                                            className="goal-img"
                                            width="25px"
                                            src={`${player[5]}`}
                                            alt={` logo`}
                                        />
                                        {player[0]}
                                        <div className="goal-time">
                                            {player[1]} points ({player[3]} G, {player[4]} A)
                                        </div>
                                    </ListItem>
                                </div>
                            );
                        })}
                    </List>
                </Paper>
                <br />
                {scheduleData.length > 0 &&
                    <Grid container justifyContent='center' spacing={5}>
                        {scheduleData &&
                            scheduleData.map((game, index) => {
                                let endStatus = '';
                                if (game.status === 'Final') {
                                    if (goalData[index][goalData[index].length-1].period === 'OT') {
                                        endStatus = '/OT';
                                    }
                                    if (goalData[index][goalData[index].length-1].period === 'SO') {
                                        endStatus = '/SO';
                                    }
                                }
                                return buildGame(game, gameData[index], goalData[index], endStatus);
                            })
                        }
                    </Grid>
                }
                {scheduleData.length === 0 &&
                    <h3>There are no games schedule on this date!</h3>
                }
            </div>
        );
    }
};

export default Schedule;