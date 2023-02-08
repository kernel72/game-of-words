from fastapi import FastAPI

from resources.library import Library
from resources.game_sessions_manager import (
    GameSessionsManager,
    routes as game_sessions_routes
)


library = Library()
library.load_dictionary_index("../dicts/words-rus-index.json")

gamesManager = GameSessionsManager()
gamesManager.set_library(library=library)

app = FastAPI()
app.include_router(router=game_sessions_routes.router)


    

