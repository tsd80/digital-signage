const jsonArr = JSON.parse('{"datetime":"2019-03-07T13:06:23.000Z","data":{"battery":[{"index":0,"value":31,"unit":"percent"}],"temperature":[{"index":0,"value":24.8,"unit":"celsius"}, {"index":1,"value":24.8,"unit":"celsius"}],"latitude":[{"index":0,"value":60.12983,"unit":"degree"}],"longitude":[{"index":0,"value":20.25071,"unit":"degree"}]},"device_id":"5c4a48b9181d89091f40ae83","device_serial":"2000611008082900","sensor_id":"5c81074d370c38dd27e8813c","sensor_id_name":"dummy_zTrack_Pro"}');

const mainArr = jsonArr.data;
mainArr.location = {};/*
mainArr.location.latitude = [];
mainArr.location.longitude = [];*/
mainArr.location.latitude = mainArr.latitude;
mainArr.location.longitude = mainArr.longitude;
delete mainArr.latitude;
delete mainArr.longitude;

for(let g in mainArr) {
    const u = mainArr[g];
    u.sort((a, b) => {
        return a.index - b.index;
    });
}