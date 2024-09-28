from flask import Flask, send_from_directory
from flask_socketio import SocketIO, emit

from GameManager import GameManager

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins='*')

game_manager = GameManager()

@app.route('/')
@app.route('/server')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@socketio.on('connect')
def test_connect():
    print('Client connected')

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

@socketio.on('join_game')
def handle_join_game(data):
    player_id = data['player_id']
    game_manager.add_player(player_id)
    emit('update', {'data': f'Player {player_id} has joined!'})

if __name__ == '__main__':
    socketio.run(app)

