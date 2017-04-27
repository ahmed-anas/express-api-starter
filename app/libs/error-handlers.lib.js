module.exports.getErrorMessage = function(err){
    if(!err){
        return 'Unknown error';
    }
    if (typeof err === 'string'){
        return err;
    }
    else if (err.toString){
        return err.toString();
    }
    else if (err.error && err.error.toString){
        return err.error.toString();
    }
    else if (err.message && err.message.toString){
        return err.message.toString();
    }

    return 'Unknown error';
}