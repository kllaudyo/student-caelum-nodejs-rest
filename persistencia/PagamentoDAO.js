function PagamentoDAO(connection){
    //objeto privado connection
    this._connection = connection;
}

PagamentoDAO.prototype.insert = function(pagamento, callback){
    this._connection.query('INSERT INTO pagamento SET ?', pagamento, callback);
};

PagamentoDAO.prototype.update = function(pagamento, callback){
    this._connection.query('UPDATE pagamento SET status = ?, data = ? where id_pagamento = ?', [pagamento.status, pagamento.data, pagamento.id_pagamento], callback);
};

PagamentoDAO.prototype.findAll = function(callback){
    this._connection.query('SELECT * FROM pagamento', callback);
};

PagamentoDAO.prototype.findById = function (id, callback){
    this._connection.query('SELECT * FROM pagamento WHERE id_pagamento = ?', [id], callback);
};

module.exports = function () {
    return PagamentoDAO;
};