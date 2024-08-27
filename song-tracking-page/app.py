from flask import Flask, request, send_file
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.tri as tri
import io

app = Flask(__name__, static_folder='song-tracking-page', static_url_path='')

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/generate-graph', methods=['POST'])
def generate_graph():
    data = request.get_json()
    print("Received data:", data)

    if not data:
        return "No data received", 400

    required_fields = ['danceability', 'energy', 'speechiness', 'acousticness', 'instrumentalness', 'liveness']
    if not all(field in data for field in required_fields):
        return "Missing required fields", 400

    proportions = [
        data.get('danceability', 0),
        data.get('energy', 0),
        data.get('speechiness', 0),
        data.get('acousticness', 0),
        data.get('instrumentalness', 0),
        data.get('liveness', 0)
    ]
    labels = ['danceability', 'energy', 'speechiness', 'acousticness', 'instrumentalness', 'liveness']
    N = len(proportions)
    proportions = np.append(proportions, 1)
    theta = np.linspace(0, 2 * np.pi, N, endpoint=False)
    x = np.append(np.sin(theta), 0)
    y = np.append(np.cos(theta), 0)
    triangles = [[N, i, (i + 1) % N] for i in range(N)]
    triang_backgr = tri.Triangulation(x, y, triangles)
    triang_foregr = tri.Triangulation(x * proportions, y * proportions, triangles)
    cmap = plt.cm.rainbow_r
    colors = np.linspace(0, 1, N + 1)
    plt.tripcolor(triang_backgr, colors, cmap=cmap, shading='gouraud', alpha=0.4)
    plt.tripcolor(triang_foregr, colors, cmap=cmap, shading='gouraud', alpha=0.8)
    plt.triplot(triang_backgr, color='white', lw=2)
    for label, color, xi, yi in zip(labels, colors, x, y):
        plt.text(xi * 1.05, yi * 1.05, label,
                 ha='left' if xi > 0.1 else 'right' if xi < -0.1 else 'center',
                 va='bottom' if yi > 0.1 else 'top' if yi < -0.1 else 'center')
    plt.axis('off')
    plt.gca().set_aspect('equal')
    
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    return send_file(img, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True, port=5500)
