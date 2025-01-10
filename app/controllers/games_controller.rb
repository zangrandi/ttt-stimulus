class GamesController < ApplicationController
  def index
    @game = Game.create
  end

  def show
    @game = Game.find_by(token: params[:id])

    unless @game
      redirect_to root_path, alert: "Game not found"
    end
  end
end
