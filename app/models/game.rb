class Game < ApplicationRecord
  validates :token, presence: true, uniqueness: true

  before_validation :generate_token, on: :create
  before_validation :set_initial_state, on: :create

  private

  def generate_token
    self.token ||= SecureRandom.hex(6)
  end

  def set_initial_state
    self.state ||= { board: Array.new(9, nil), current_player: 'X' }
  end
end