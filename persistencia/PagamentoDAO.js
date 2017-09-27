function PagamentoDAO(connection){
    //objeto privado connection
    this._connection = connection;
}

PagamentoDAO.prototype.save = function(pagamento, callback){
    this._connection.query('INSERT INTO pagamento SET ?', pagamento, callback);
};

PagamentoDAO.prototype.findAll = function(callback){
    this._connection.query('SELECT * FROM PAGAMENTOS', callback);
};

PagamentoDAO.prototype.findById = function (id, callback){
    this._connection.query('SELECT * FROM PAGAMENTOS WHERE ID_PAGAMENTO = ?', [id], callback);
};

module.exports = function () {
    return PagamentoDAO;
};