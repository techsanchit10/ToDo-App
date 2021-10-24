const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'To Do',
    enum: ['To Do', 'In Progress', 'Completed']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  updatedOn: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false });

projectSchema.pre('updateOne', function(){
  this.set({ updatedOn: Date.now() });
});

const projectModel = mongoose.model('Project', projectSchema);

module.exports = projectModel;