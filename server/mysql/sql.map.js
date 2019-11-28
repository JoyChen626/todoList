var sqlMap = {
    user: {
        add: 'insert into user (username, password, userphone) values (?,?,?)',
        select_user: 'select * from user ',
        update_user: 'update user set '
    },
    thing: {
        add: 'insert into thing (userid, thing, create_at,status) values (?,?,?,?)',
        get: 'select * from thing ',
        updata_thing: 'UPDATE thing SET ',
        delete_thing: 'delete from thing '
    }
}
module.exports = sqlMap;
