import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';

const Team = () => {
    const {id} = useParams();
    const [teamData, setTeamData] = useState(undefined);
    const [players, setPlayers] = useState([]);
    const [stats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(`http://localhost:3030/teams/${id}`);
                setTeamData(data);
                setPlayers(data.players);

                let playerIds = [];
                data.players.forEach((player) => {
                    playerIds.push(player.playerId);
                    return player;
                });

                for (let i = 0; i < playerIds.length; i++) {
                    try {
                        const { data } = await axios.get(`http://localhost:3030/player/${playerIds[i]}`);
                        stats.push(data);
                    } catch (e) {
                        console.log(e);
                    }
                }

                console.log(stats);

                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }

        if (id) {
            fetchData();
        }
    }, [id])

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
                <h1>{teamData.name}</h1>
                <br />
                <img
                    width="350px"
                    src={`${teamData.imageUrl}`}
                    alt={`${teamData.name}`}
                />
                <br />
                <TableContainer
                    sx={{
                        margin: '10px',
                        width: '50%',
                        marginLeft: '25%',
                        background: '#1f1f1f',
                        maxHeight: '500px'
                    }}
                    component={Paper}
                >
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableCell sx={{color: '#1f1f1f'}} align='left'>Name</TableCell>
                            <TableCell sx={{color: '#1f1f1f'}} align='left'>Number</TableCell>
                            <TableCell sx={{color: '#1f1f1f'}} align='left'>Position</TableCell>
                            <TableCell sx={{color: '#1f1f1f'}} align='left'>G</TableCell>
                            <TableCell sx={{color: '#1f1f1f'}} align='left'>A</TableCell>
                            <TableCell sx={{color: '#1f1f1f'}} align='left'>PTS</TableCell>
                            <TableCell sx={{color: '#1f1f1f'}} align='left'>+/-</TableCell>
                            <TableCell sx={{color: '#1f1f1f'}} align='left'>S</TableCell>
                            <TableCell sx={{color: '#1f1f1f'}} align='left'>S%</TableCell>
                            <TableCell sx={{color: '#1f1f1f'}} align='left'>PIM</TableCell>
                            <TableCell sx={{color: '#1f1f1f'}} align='left'>TOI/G</TableCell>
                        </TableHead>
                        <TableBody>
                            {players.map((player, index) => {
                                return(
                                    <TableRow
                                        key={player.name}
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 }
                                        }}
                                    >
                                        <TableCell sx={{color: '#e1e1e1'}} component='th' scope='row'>
                                            {player.name}
                                        </TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>{player.jerseyNumber}</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>{player.position}</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>{stats[index].goals}</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>{stats[index].assists}</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>{stats[index].points}</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>{stats[index].plusMinus}</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>{stats[index].shots}</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>{stats[index].shotPercentage}</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>{stats[index].pim}</TableCell>
                                        <TableCell sx={{color: '#e1e1e1'}} align='left'>{stats[index].timeOnIcePerGame}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
};

export default Team;