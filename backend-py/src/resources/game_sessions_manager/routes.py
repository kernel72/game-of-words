from fastapi import APIRouter, status, HTTPException
from pydantic import BaseModel

from .model import (
    GameSessionsManager,
    GameOptions,
    GameNotFoundException,
    WordIsNotIncludedException,
    WordIsAlreadyFoundException,
    WordLengthIsLessThanRequiredException,
)

router = APIRouter(
    prefix="/session",
)

gamesManager = GameSessionsManager()

class CreateSessionRequestBody(BaseModel):
    minimal_word_length: int | None

@router.post("", status_code=status.HTTP_201_CREATED)
def create_session(request_body: CreateSessionRequestBody):
    minimal_word_length = request_body.minimal_word_length or 5

    if(minimal_word_length < 3):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Minimal amount can't be less than 3")

    options = GameOptions(minimal_word_length=minimal_word_length)
    new_session = gamesManager.createSession(options=options)
    game_data = new_session.get_full_game_data()

    return {
        'session_id': game_data.id,
        'main_word': game_data.main_word.word,
        'known_words_amount': len(game_data.main_word.included_words),
        'found_words': game_data.found_words
    }


@router.get(
    path="/{session_id}", responses={404: {"description": "Session is not found"}}
)
def get_session(session_id: str):
    try:
        game_session = gamesManager.getSessionById(session_id)
    except GameNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail={"error_key": e.error_key}
        )

    game_data = game_session.get_full_game_data()

    return {
        'session_id': game_data.id,
        'main_word': game_data.main_word.word,
        'known_words_amount': len(game_data.main_word.included_words),
        'found_words': game_data.found_words
    }


class ApplyWordRequestBody(BaseModel):
    word: str


@router.post(
    path="/{session_id}/apply",
    responses={
        404: {"description": "Session is not found"},
        400: {"description": "Something wrong with word"},
    },
)
def apply_word(session_id: str, request_body: ApplyWordRequestBody):
    try:
        game_session = gamesManager.getSessionById(session_id)
        game_data = game_session.check_and_apply_word(request_body.word)
    except GameNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail={"error_key": e.error_key}
        )
    except WordIsNotIncludedException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail={"error_key": e.error_key}
        )

    except WordIsAlreadyFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail={"error_key": e.error_key}
        )
    except WordLengthIsLessThanRequiredException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error_key": e.error_key, "error_params": e.error_params},
        )

    return {
        'session_id': game_data.id,
        'main_word': game_data.main_word.word,
        'known_words_amount': len(game_data.main_word.included_words),
        'found_words': game_data.found_words
    }
