import React, { Component } from 'react';
import WeekCalendar from 'react-week-calendar'
import moment from 'moment';
import { Col, Row, Table, Modal } from 'antd'
import './App.css';
import 'react-week-calendar/dist/style.css';

const Block = (props) => {
  const { uid, start, end, value, student, done, onComplete, onClick } = props
  return (
    <div className="event" style={{"backgroundColor": done ? "rgba(139,195,74,.4)" : "rgba(255, 0, 0, 0.32)"}}>
      <span>{`${start.format('HH:mm')} - ${end.format('HH:mm')}`}</span>
      <br />
        <div>
          <a href="#" onClick={e => onClick(e, uid)}>
            {student}
            <br />
            {value}
          </a>
        </div>
      <br />
      <label>
        <input checked={done} type="checkbox" onChange={e => onComplete(e, uid)} />
        <span>Check complete</span>
      </label>
    </div>
  )
}

const DayCell = (props) => {
  const handleMouseDown = (e) => {
    if (e.button === 0) {
      props.startSelection();
    }
  }

  const drawRowLine = () => {
    const rowPos = [3, 7, 11, 13, 17, 21, 25]
    return rowPos.includes(props.rowPos)
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      className="dayCell"
      role="presentation"
      style={{borderTop: drawRowLine() ? "1px solid black" : "1px solid #b7b7b7"}}
    >
        {props.rowPos === 11 ? "LUNCH" : ""}
    </div>
  );
}

const ServiceForm = (props) => {
  const { service, i, updateService, getTotalMinutes } = props
  const { minutes, numSessions, frequency, content, location } = service
  return (
    <div>
      <h4>Service {i + 1}</h4>
      <label><span>Minutes per Session{"    "}</span>
        <input value={minutes} onChange={e => updateService(i, {minutes: e.target.value})} />
      </label>
      <br /><br />
      <label><span>Number of Sessions{"    "}</span>
        <input value={numSessions} onChange={e => updateService(i, {numSessions: e.target.value})} />
      </label>
      <br /><br />
      <select value={frequency} onChange={e => updateService(i, {frequency: e.target.value})}>
        <option key={`select-${i}`} value={''}>{'Select Frequency'}</option>
        <option key={`weekly-${i}`} value={'weekly'}>{'Weekly'}</option>
        <option key={`daily-${i}`} value={'daily'}>{'Daily'}</option>
      </select>
      <br /><br />
      <span>Total Minutes per Week: {getTotalMinutes({minutes, numSessions, frequency})}</span>
      <br /><br />
      <select value={content} onChange={e => updateService(i, {content: e.target.value})}>
        <option key={`content-${i}`} value={''}>{'Select Content Area'}</option>
        <option key={`english-${i}`} value={'English'}>{'English'}</option>
        <option key={`math-${i}`} value={'Math'}>{'Math'}</option>
        <option key={`science-${i}`} value={'Science'}>{'Science'}</option>
        <option key={`history-${i}`} value={'History'}>{'History'}</option>
        <option key={`elective-${i}`} value={'Elective'}>{'Elective'}</option>
      </select>
      <br /><br />
      <select value={location} onChange={e => updateService(i, {location: e.target.value})}>
        <option key={`location-${i}`} value={''}>{'Select Location'}</option>
        <option key={`general-${i}`} value={'General Ed classroom'}>{'General Ed classroom'}</option>
        <option key={`sped-${i}`} value={'Special Ed classroom'}>{'Special Ed classroom'}</option>
      </select>
      <br /><br />
    </div>
  )
}

const blankService = {
  minutes: 0,
  numSessions: 0,
  frequency: '',
  content: '',
  location: ''
}

class App extends Component {
  state = {
    title: 'SPEDULE',
    lastUid: 4,
    selectedIntervals: [
      {
        uid: 1,
        start: moment({h: 9, m: 15}).add(2,'d'),
        end: moment({h: 10, m: 15}).add(2,'d'),
        value: "General Education English",
        student: "BC123",
        done: true,
        notes: 'Awesome day!',
        rating: 4
      },
      {
        uid: 2,
        start: moment({h: 13, m: 0}).add(3,'d'),
        end: moment({h: 13, m: 45}).add(3,'d'),
        value: "Special Education Math",
        student: "FG456",
        done: false,
        notes: '',
        rating: ''
      },
      {
        uid: 3,
        start: moment({h: 11, m: 45}).add(4,'d'),
        end: moment({h: 12, m: 45}).add(4,'d'),
        value: "Special Education English",
        student: "BC123",
        done: false,
        notes: '',
        rating: ''
      },
    ],
    studentData: [
      {
        student: "BC123",
        required: 120,
        visible: true
      },
      {
        student: "FG456",
        required: 45,
        visible: true
      }
    ],
    studentInitials: '',
    services: [{ ...blankService }],
    selectedRowKeys: [],
    showAddStudentModal: false,
    showNoteModal: '',
    notes: '',
    rating: ''
  }

  componentDidMount () {
    const selectedIntervals = this.state.selectedIntervals.map(interval => ({
      ...interval,
      onComplete: this.onComplete,
      onClick: this.onClick
    }))
    this.setState({ selectedIntervals, selectedRowKeys: this.state.studentData.map((x, i) => i) })
  }

  handleEventRemove = (event) => {
    const {selectedIntervals} = this.state;
    const index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
    if (index > -1) {
      selectedIntervals.splice(index, 1);
      this.setState({selectedIntervals});
    }

  }

  handleEventUpdate = (event) => {
    const {selectedIntervals} = this.state;
    const index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
    if (index > -1) {
      selectedIntervals[index] = event;
      this.setState({selectedIntervals});
    }
  }

  handleSelect = (newIntervals) => {
    const {lastUid, selectedIntervals} = this.state;
    const intervals = newIntervals.map( (interval, index) => {

      return {
        ...interval,
        uid: lastUid + index,
        onComplete: this.onComplete,
        onClick: this.onClick
      }
    });

    this.setState({
      selectedIntervals: selectedIntervals.concat(intervals),
      lastUid: lastUid + newIntervals.length
    })
  }

  onComplete = (e, uid) => {
    const selectedIntervals = this.state.selectedIntervals
    selectedIntervals.find(interval => interval.uid === uid).done = e.target.checked
    this.setState({ selectedIntervals })
  }

  columns = [{
    title: 'Student ID',
    dataIndex: 'student',
    key: 'student'
  }, {
    title: 'Required',
    dataIndex: 'required',
    key: 'required'
  }, {
    title: 'Scheduled',
    dataIndex: 'scheduled',
    key: 'scheduled'
  },
  {
    title: 'Actual',
    dataIndex: 'actual',
    key: 'actual'
  }]

  getData = () => {
    const studentMap = {}
    this.state.selectedIntervals.forEach(block => {
      if (!studentMap[block.student]) {
        studentMap[block.student] = {
          student: block.student,
          scheduled: 0,
          actual: 0
        }
      }
      const duration = moment.duration(block.end.diff(block.start)).asMinutes()

      studentMap[block.student].scheduled += duration
      if (block.done) {
        studentMap[block.student].actual += duration
      }
    })

    return this.state.studentData.map((row, i) => {
      return {
        key: i,
        student: row.student,
        required: row.required,
        scheduled: studentMap[row.student].scheduled,
        actual: studentMap[row.student].actual
      }
    })
  }

  showAddStudentModal = () => {
    this.setState({ showAddStudentModal: true })
  }

  addStudentDemo = () => {
    this.setState({
      showAddStudentModal: true,
      studentInitials: 'BB',
      services: [{
        minutes: 45,
        numSessions: 2,
        frequency: 'weekly',
        content: 'Math',
        location: 'General Ed classroom'
      },
      {
        minutes: 60,
        numSessions: 1,
        frequency: 'daily',
        content: 'English',
        location: 'Special Ed classroom'
      }],
    })
  }

  getTotalMinutes = ({ minutes, numSessions, frequency }) => {
    return minutes * numSessions * (frequency === 'weekly' ? 1 : (frequency === 'daily' ? 5 : 0))
  }

  getVisibleIntervals = () => {
    return this.state.selectedIntervals
      .filter(interval => this.state.studentData.find(s => s.student === interval.student).visible)
  }

  handleOk = () => {
    const newIntervals = []
    let totalRequired = 0
    const student = `${this.state.studentInitials}${Math.floor(Math.random() * 1000)}`
    this.state.services.forEach((service, i) => {
      const interval = {
        value: `${service.location} ${service.content}`,
        student,
        done: false,
        notes: '',
        rating: ''
      }
      if (i === 0) {
        newIntervals.push({
          ...interval,
          start: moment({h: 9, m: 15}).add(3,'d'),
          end: moment({h: 10, m: 0}).add(3,'d'),
        })
        newIntervals.push({
          ...interval,
          start: moment({h: 9, m: 15}).add(4,'d'),
          end: moment({h: 10, m: 0}).add(4, 'd'),
        })
      } else if (i === 1) {
        const nums = [1, 2, 3, 4, 5]
        nums.forEach(num => {
          if (num === 3) {
            newIntervals.push({
              ...interval,
              start: moment({h: 11, m: 45}).add(num,'d'),
              end: moment({h: 12, m: 45}).add(num,'d'),
            })
          } else if (num === 1) {
            newIntervals.push({
              ...interval,
              start: moment({h: 10, m: 15}).add(num,'d'),
              end: moment({h: 11, m: 15}).add(num,'d'),
              notes: 'Amazing class!',
              rating: 5
            })
          } else {
            newIntervals.push({
              ...interval,
              start: moment({h: 10, m: 15}).add(num,'d'),
              end: moment({h: 11, m: 15}).add(num,'d'),
            })
          }
        })

      }
      this.handleSelect(newIntervals)
      totalRequired += this.getTotalMinutes(service)
    })

    const studentData = this.state.studentData
    studentData.push({
      student,
      required: totalRequired,
      visible: true
    })
    const selectedRowKeys = this.state.selectedRowKeys
    selectedRowKeys.push(studentData.length - 1)

    this.setState({
      showAddStudentModal: false,
      studentInitials: '',
      services: [{ ...blankService }],
      studentData,
      selectedRowKeys
    })
  }

  handleCancel = () => {
    this.setState({ showAddStudentModal: false })
  }

  updateStudentInitials = (e) => {
    this.setState({ studentInitials: e.target.value })
  }

  updateService = (i, updated) => {
    const services = this.state.services
    services[i] = Object.assign(services[i], updated)
    this.setState({ services })
  }

  addService = () => {
    const services = this.state.services
    services.push({ ...blankService })
    this.setState({ services })
  }

  onClick = (e, uid) => {
    e.preventDefault()
    const interval = this.state.selectedIntervals.find(interval => interval.uid === uid)
    const { notes, rating } = interval
    this.setState({ showNoteModal: uid, notes, rating })
  }

  updateNotes = (e) => {
    this.setState({ notes: e.target.value })
  }

  updateRating = (e) => {
    this.setState({ rating: e.target.value })
  }

  handleOkNotes = () => {
    const selectedIntervals = this.state.selectedIntervals
    const interval = selectedIntervals.find(interval => interval.uid === this.state.showNoteModal)
    interval.notes = this.state.notes
    interval.rating = this.state.rating
    this.setState({ showNoteModal: '', notes: '', rating: '', selectedIntervals })
  }

  handleCancelNotes = () => {
    this.setState({ showNoteModal: '' })
  }

  showAlert = (e) => {
    e.preventDefault()
    alert("Update BB's schedule!")
  }

  render() {
    // rowSelection object indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        const studentData = this.state.studentData
        studentData.forEach((row, i) => {
          row.visible = selectedRowKeys.includes(i)
        })
        this.setState({ studentData, selectedRowKeys })
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
      selectedRowKeys: this.state.selectedRowKeys
    }

    return (
      <div className="App">
        <header><img src={"spedule-logo.png"} alt="logo" style={{width: "200px"}}/></header>
        <Row>
          <Col span={16}>
            <div>
              <WeekCalendar
                firstDay={moment('20180430')}
                numberOfDays={5}
                startTime={moment({h: 8, m: 30})}
                endTime={moment({h: 15, m: 30})}
                selectedIntervals = {this.getVisibleIntervals()}
                onIntervalSelect = {this.handleSelect}
                onIntervalUpdate = {this.handleEventUpdate}
                onIntervalRemove = {this.handleEventRemove}
                eventComponent={Block}
                useModal={false}
                dayCellComponent={DayCell}
                cellHeight={30}
                dayFormat={'dd., MM.DD'}
              />
            </div>
          </Col>
          <Col span={8}>
            <h2>{'My data'}</h2>
            <div>
              <Table
                dataSource={this.getData()}
                columns={this.columns}
                pagination={false}
                rowSelection={rowSelection}
              />
              <div>
                <button onClick={this.showAddStudentModal}>Add Student</button>
                <Modal
                  title="Add a Student"
                  visible={this.state.showAddStudentModal}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                >
                  <label><span>Student Initials{"    "}</span>
                    <input value={this.state.studentInitials} onChange={this.updateStudentInitials} />
                  </label>
                  <br />
                  <br />
                  {this.state.services.map((service, i) => (
                    <ServiceForm
                      service={service}
                      i={i}
                      updateService={this.updateService}
                      key={`serviceform-${i}`}
                      getTotalMinutes={this.getTotalMinutes}
                    />
                  ))}
                  <br />
                  <button onClick={this.addService}>Add Service</button>
                </Modal>
                {"    "}
                <button>Export</button>
                <br /><br /><br />
                <button onClick={this.addStudentDemo}>Add Student DEMO</button>
                <br />
                <a href="" onClick={this.showAlert} style={{color: "white"}}>SHOW ALERT</a>
              </div>
            </div>
          </Col>
        </Row>
        <Modal
          title="Session Details"
          visible={!!this.state.showNoteModal}
          onOk={this.handleOkNotes}
          onCancel={this.handleCancelNotes}
        >

        <label><span>Rating (1-5):{"    "}</span>
          <input onChange={this.updateRating} value={this.state.rating} />
        </label>
          <br />
          <br />
          <label><span>Notes{"    "}</span>
            <br />
            <textarea onChange={this.updateNotes} value={this.state.notes} style={{width: "100%", height: "100px"}} />
          </label>
          <br />
          <br />
          <br />
        </Modal>
      </div>
    );
  }
}

export default App;
