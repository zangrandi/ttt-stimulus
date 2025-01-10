class CellComponent < ViewComponent::Base
  def initialize(cell_id:, value:, size:, winner: false)
    @cell_id = cell_id
    @value = value
    @size = size
    @winner = winner
    @text_class_name = {
      2 => "text-8xl",
      1 => "text-5xl",
      0 => "text-2xl"
    }[size]
    @color_class_name = {
      "X" => "text-blue-700",
      "O" => "text-red-700"
    }[value]
  end
end