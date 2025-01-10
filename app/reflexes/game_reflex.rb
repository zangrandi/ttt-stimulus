class GameReflex < ApplicationReflex
  def place_piece(params)
    game = Game.find_by(token: params[:token])
    cell_id = params[:cell_id].to_i

    game.state["board"][cell_id] = {
      player: params[:player],
      size: params[:size].to_i
    }

    game.state["current_player"] = params[:player] == "X" ? "O" : "X"
    game.save
    
    morph "#cell-#{cell_id}", render(CellComponent.new(
      cell_id:,
      value: params[:player], 
      size: params[:size].to_i
    ))
  end
end