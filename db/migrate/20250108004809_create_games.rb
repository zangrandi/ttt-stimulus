class CreateGames < ActiveRecord::Migration[7.1]
  def change
    create_table :games do |t|
      t.string :token
      t.json :state

      t.timestamps
    end
  end
end
