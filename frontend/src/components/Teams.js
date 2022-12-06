import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography
} from '@mui/material';

const Teams = () => {
    const [teamData, setTeamData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get('http://localhost:3030/teams');
                setTeamData(data);
                console.log(teamData);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }

        fetchData();
    }, [loading]);

    const buildCard = (team) => {
        return(
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={team.teamId}>
                <Card
                    className="card"
                    sx={{
                        backgroundColor: '#1f1f1f',
                        padding: '10px',
                        border: 'solid',
                        borderRadius: '10px',
                        margin: '20px'
                    }}
                >
                    <Link className="team-link" to={`/teams/${team.teamId}`}>
                        <CardActionArea
                            sx={{
                                padding: '10px',
                                borderRadius: '10px'
                            }}
                        >
                            <CardMedia
                                component='img'
                                src={
                                    `${team.imageUrl}`
                                }
                                title={`${team.name}`}
                            />
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant='h6'
                                    component='h2'
                                    sx={{
                                        color: '#e1e1e1'
                                    }}
                                >
                                    {`${team.name}`}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Link>
                </Card>
            </Grid>
        );
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
                <Grid container justifyContent='center' spacing={5}>
                    {teamData &&
                        teamData.map((team) => {
                            return buildCard(team);
                        })
                    }
                </Grid>
            </div>
        );
    }
};

export default Teams;