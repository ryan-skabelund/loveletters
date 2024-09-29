from flask import Flask, send_from_directory, request
from flask_socketio import SocketIO, emit

from GameManager import GameManager, RoundPhase

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins='*')

game_manager = GameManager()

def send_game_state():
    socketio.emit('game_state', game_manager.serialize_game_state())

@app.route('/')
@app.route('/observer')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@socketio.on('connect')
def test_connect():
    send_game_state()
    print('Client connected')

@socketio.on('disconnect')
def test_disconnect():
    game_manager.remove_player(request.sid)
    print('Client disconnected')

@socketio.on('join_game')
def handle_join_game(data):
    player_name = data['player_name']
    if game_manager.add_player(player_name, request.sid):
        socketio.emit('joined', to=request.sid)
    else:
        socketio.emit('failed_to_join', to=request.sid)
        print(f"Sending failed to join to {request.sid}")
        return False
    send_game_state()

@socketio.on('start_game')
def start_game(data):
    if not game_manager.start_game():
        socketio.emit('failed_to_start', to=request.sid)
        return False
    send_game_state()

@socketio.on('submit_response')
def submit_response(data):
    if not game_manager.submit_response(request.sid, data):
        socketio.emit('failed_to_submit')
        return False

    if game_manager.round_phase == RoundPhase.WATCH:
        def view_next_player():
            socketio.sleep(12)
            if game_manager.viewing_index + 1 < len(game_manager.players):
                game_manager.viewing_index += 1
                send_game_state()
                socketio.start_background_task(view_next_player)
            else:
                game_manager.round_phase = RoundPhase.VOTE
                socketio.emit('refresh')
                game_manager.__init__()
                send_game_state()

        socketio.start_background_task(view_next_player)

    send_game_state()

@socketio.on('submit_vote')
def submit_vote(data):
    if not game_manager.vote_for_player(data['selected_username'], request.sid):
        socketio.emit('failed_to_vote')
    send_game_state()

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
