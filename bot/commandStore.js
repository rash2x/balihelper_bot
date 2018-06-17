let commands = [];

module.exports = {
    get: function(id){
        return commands.find(x => x.userId === id);
    },
    add: function(id, text){
        const isExist = commands.findIndex(x => x.userId === id);

        if(isExist >= 0){
            commands.splice(isExist, 1);
        }

        commands.push({
            userId: id,
            text: text
        })
    }
};