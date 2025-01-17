from .view_route import view_route
from .ai_route import ai_route

blueprints = [
    (view_route,"/"),
    (ai_route,"/api/ai")
]

def register_blueprints(app):
    for blueprint,prefix in blueprints:
        app.register_blueprint(blueprint,url_prefix=prefix)