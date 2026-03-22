from flask import Flask,jsonify, make_response, request
from flask_cors import CORS
import mysql.connector
app = Flask(__name__)
CORS(app)
db_config = {
    'host': 'xxxxxxx',
    'user': 'xxxxxx',
    'password': 'xxxxxxxx',
    'database': 'xxxxxxxx'
}
def get_db_connection():
    return mysql.connector.connect(**db_config)
@app.route('/')
def home():
    return '<h1>estamos de volta!</h1>'
@app.route('/api', methods=['GET'])
def listar_banco():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM gafanhotos')
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return make_response(jsonify(
        a_mensagem = 'banco de dados cadastro',
        dados = resultados
        ))
@app.route('/api', methods=['POST'])
def create_something():
    item = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    sql = """INSERT INTO gafanhotos 
                 (codigo, nome, prof, nascimento, sexo, peso, altura, nacionalidade, cursopreferido) 
                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    codigo = item.get('codigo')
    valores = (
            codigo,
            item.get('nome'),
            item.get('prof'),
            item.get('nascimento'),
            item.get('sexo'),
            item.get('peso'),
            item.get('altura'),
            item.get('nacionalidade', 'Brasil'),
            item.get('cursopreferido')
        )
    cursor.execute(sql, valores)
    conn.commit()
    novo_id = cursor.lastrowid
    cursor.execute("SELECT * FROM gafanhotos WHERE id = %s", (novo_id,))
    novo_registro = cursor.fetchone()
    cursor.close()
    conn.close()
    return make_response(jsonify({
        "mensagem": "Gafanhoto criado com sucesso!",
        "dados": novo_registro
    }), 201)
@app.route('/api/<int:id>', methods=['DELETE'])
def deletar_gafanhoto(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    sql = """DELETE FROM GAFANHOTOS WHERE id = %s"""
    cursor.execute(sql, (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return make_response(jsonify({
        "mensagem": f"Gafanhoto com id {id} excluído com sucesso!"
    }), 200)
@app.route('/api/<int:id>/<string:campo>', methods=['PUT'])
def editar_gafanhoto(id,campo):
    item = request.get_json()
    alteracao = item.get(campo)
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    sql = f"UPDATE gafanhotos SET `{campo}` = %s WHERE id = %s"
    cursor.execute(sql, (alteracao, id))
    conn.commit()
    cursor.close()
    conn.close()
    return make_response(jsonify({
        "mensagem": f"Campo '{campo}' do id {id} atualizado para '{alteracao}'!"
    }), 200)
if __name__ == '__main__':
    app.run(debug=True)
