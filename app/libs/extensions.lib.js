Date.prototype.toMysqlDateTime = function(){
    return this.getUTCFullYear() + '-' + (1 + this.getUTCMonth()) + '-' + this.getUTCDate() + ' ' + this.getUTCHours() + ':' + this.getUTCMinutes() + ':' + this.getUTCSeconds();
}