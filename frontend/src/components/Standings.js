import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid
} from '@mui/material';
import { Link } from 'react-router-dom';

const Standings = () => {
    const [standingsData, setStandingsData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get('http://localhost:3030/standings');
                setStandingsData(data);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }

        fetchData();
    }, [loading])

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
                <Grid container justifyContent='center' spacing={5}>
                    {standingsData.map((division) => {
                        return(
                            <Grid sx={{margin: '10px'}} item>
                                <h1>{division[0].division} Division</h1>
                                <TableContainer
                                    sx={{
                                        width: '100%',
                                        backgroundColor: '#1f1f1f'
                                    }}
                                    component={Paper}
                                    key={`${division[0].id}`}
                                >
                                <Table
                                    aria-label="simple table"
                                >
                                    <TableHead>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>Rank</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>Team</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>GP</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>W</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>L</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>OT</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>PTS</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>P%</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>GF</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>GA</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>DIFF</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>STRK</TableCell>
                                    </TableHead>
                                    <TableBody>
                                        {division.map((team) => {
                                            return(
                                                <TableRow
                                                    key={team.name}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': { border: 0 }
                                                    }}
                                                >
                                                    <TableCell sx={{color: '#e1e1e1'}} component='th' scope='row'>{team.divisionRank}</TableCell>
                                                    <TableCell sx={{color: '#e1e1e1'}} align='left'>
                                                        <Link to={`/teams/${team.id}`}>
                                                            <img
                                                                width="25px"
                                                                src={`${team.imageUrl}`}
                                                                alt={`${team.name} logo`}
                                                            />
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell sx={{color: '#e1e1e1'}} align='left'>{team.gamesPlayed}</TableCell>
                                                    <TableCell sx={{color: '#e1e1e1'}} align='left'>{team.wins}</TableCell>
                                                    <TableCell sx={{color: '#e1e1e1'}} align='left'>{team.losses}</TableCell>
                                                    <TableCell sx={{color: '#e1e1e1'}} align='left'>{team.ot}</TableCell>
                                                    <TableCell sx={{color: '#e1e1e1'}} align='left'>{team.points}</TableCell>
                                                    <TableCell sx={{color: '#e1e1e1'}} align='left'>{team.pointsPercentage}</TableCell>
                                                    <TableCell sx={{color: '#e1e1e1'}} align='left'>{team.goalsScored}</TableCell>
                                                    <TableCell sx={{color: '#e1e1e1'}} align='left'>{team.goalsAgainst}</TableCell>
                                                    {team.goalDifferential > 0 &&
                                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>+{team.goalDifferential}</TableCell>
                                                    }
                                                    {team.goalDifferential <= 0 &&
                                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>{team.goalDifferential}</TableCell>
                                                    }
                                                    <TableCell sx={{color: '#e1e1e1'}} align='left'>{team.streak}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        );
                    })}
                </Grid>
            </div>
        );
    }
};

export default Standings;